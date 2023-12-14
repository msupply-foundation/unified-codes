use diesel::{
    connection::SimpleConnection,
    r2d2::{ConnectionManager, Pool},
    SqliteConnection,
};
use serde;

use crate::db_diesel::{DBBackendConnection, StorageConnectionManager};

// WAIT up to 5 SECONDS for lock in SQLITE (https://www.sqlite.org/c3ref/busy_timeout.html)
const SQLITE_LOCKWAIT_MS: u32 = 5000;

const SQLITE_WAL_PRAGMA: &str = "PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL;";

#[derive(serde::Deserialize, Clone)]
pub struct SqliteSettings {
    pub database_name: String,
    /// SQL run once at startup. For example, to run pragma statements
    pub init_sql: Option<String>,
}

impl SqliteSettings {
    pub fn connection_string(&self) -> String {
        self.database_name.clone()
    }

    pub fn connection_string_without_db(&self) -> String {
        self.connection_string()
    }

    pub fn full_init_sql(&self) -> Option<String> {
        //For SQLite we want to enable the Write Head Log on server startup
        match &self.init_sql {
            Some(sql_statement) => Some(format!("{};{}", sql_statement, SQLITE_WAL_PRAGMA)),
            None => Some(SQLITE_WAL_PRAGMA.to_string()),
        }
    }
}

#[derive(Debug)]
pub struct SqliteConnectionOptions {
    pub busy_timeout_ms: Option<u32>,
}

impl diesel::r2d2::CustomizeConnection<SqliteConnection, diesel::r2d2::Error>
    for SqliteConnectionOptions
{
    fn on_acquire(&self, conn: &mut SqliteConnection) -> Result<(), diesel::r2d2::Error> {
        // Set busy_timeout first, as setting WAL can generate a `busy` message during a write
        if let Some(d) = self.busy_timeout_ms {
            conn.batch_execute(&format!("PRAGMA busy_timeout = {};", d))
                .expect("Can't set busy_timeout in sqlite");
        }

        conn.batch_execute("PRAGMA foreign_keys = ON;")
            .expect("Can't enable foreign_keys in sqlite");

        Ok(())
    }
}

pub fn get_storage_connection_manager(settings: &SqliteSettings) -> StorageConnectionManager {
    let connection_manager =
        ConnectionManager::<DBBackendConnection>::new(settings.connection_string());
    let pool = Pool::builder()
        .connection_customizer(Box::new(SqliteConnectionOptions {
            busy_timeout_ms: Some(SQLITE_LOCKWAIT_MS),
        }))
        .build(connection_manager)
        .expect("Failed to connect to database");
    StorageConnectionManager::new(pool)
}

#[cfg(test)]
mod database_setting_test {
    use super::SqliteSettings;

    pub fn empty_db_settings_with_init_sql(init_sql: Option<String>) -> SqliteSettings {
        SqliteSettings {
            database_name: "".to_string(),
            init_sql,
        }
    }

    #[test]
    fn test_database_settings_full_init_sql() {
        use super::SQLITE_WAL_PRAGMA;

        //Ensure sqlite WAL is enabled if no init_sql is provided
        assert_eq!(
            empty_db_settings_with_init_sql(None).full_init_sql(),
            Some(SQLITE_WAL_PRAGMA.to_string())
        );
        //Ensure sqlite WAL is enabled if no init_sql is provided
        let init_sql = "PRAGMA temp_store_directory = '{}';";
        let expected_init_sql = format!("{};{}", init_sql, SQLITE_WAL_PRAGMA);
        assert_eq!(
            empty_db_settings_with_init_sql(Some(init_sql.to_string())).full_init_sql(),
            Some(expected_init_sql)
        );

        //Ensure sqlite WAL is enabled if init_sql is missing a trailing semicoln
        let init_sql_missing_semi_colon = "PRAGMA temp_store_directory = '{}'";
        let expected_init_sql = format!("{};{}", init_sql_missing_semi_colon, SQLITE_WAL_PRAGMA);
        assert_eq!(
            empty_db_settings_with_init_sql(Some(init_sql_missing_semi_colon.to_string()))
                .full_init_sql(),
            Some(expected_init_sql)
        )
    }
}

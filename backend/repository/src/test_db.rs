use crate::{
    database_settings::SqliteSettings,
    db_diesel::{DBBackendConnection, StorageConnection, StorageConnectionManager},
    mock::{insert_all_mock_data, insert_mock_data, MockData, MockDataCollection, MockDataInserts},
};

use diesel::r2d2::{ConnectionManager, Pool};
use diesel_migrations::mark_migrations_in_directory;

use std::{
    env,
    path::{Path, PathBuf},
};

/// Copy of search_for_diesel_migrations::migration_directory except looking in /repository/migrations
pub fn search_for_migrations_directory(path: &Path) -> Result<PathBuf, String> {
    let migration_path = path.join("repository").join("migrations");
    // println!("{:#?}", migration_path.as_os_str());
    if migration_path.is_dir() {
        Ok(migration_path)
    } else {
        path.parent()
            .map(search_for_migrations_directory)
            .unwrap_or_else(|| Err("Failed to locate migrations directory".to_string()))
    }
}

fn find_test_migration_directory() -> PathBuf {
    // Assume the base path is the base path of one of the project crates:
    search_for_migrations_directory(Path::new(&env::current_dir().unwrap())).unwrap()
}

pub async fn setup(db_settings: &SqliteSettings) -> StorageConnectionManager {
    use crate::database_settings::SqliteConnectionOptions;
    use std::fs;

    let db_path = db_settings.connection_string();

    // If not in-memory mode clean up and create test directory
    // (in in-memory mode the db_path starts with "file:")
    if !db_path.starts_with("file:") {
        // remove existing db file
        fs::remove_file(&db_path).ok();
        // create parent dirs
        let path = Path::new(&db_path);
        let prefix = path.parent().unwrap();
        fs::create_dir_all(prefix).unwrap();
    }

    let connection_manager =
        ConnectionManager::<DBBackendConnection>::new(&db_settings.connection_string());
    const SQLITE_LOCKWAIT_MS: u32 = 5000; //5 second wait for test lock timeout
    let pool = Pool::builder()
        .min_idle(Some(1))
        .connection_customizer(Box::new(SqliteConnectionOptions {
            busy_timeout_ms: Some(SQLITE_LOCKWAIT_MS),
        }))
        .build(connection_manager)
        .expect("Failed to connect to database");
    let connection = pool.get().expect("Failed to open connection");

    let migrations_dir = find_test_migration_directory();
    // migrations_dir.push(MIGRATION_PATH);
    let mut migrations = mark_migrations_in_directory(&connection, &migrations_dir).unwrap();
    migrations.sort_by(|(m, ..), (n, ..)| m.version().cmp(n.version()));
    for (migration, ..) in migrations.iter() {
        migration.run(&connection).unwrap();
    }

    StorageConnectionManager::new(pool)
}

// sqlite (username, password, host and port are ignored)
pub fn get_test_db_settings(db_name: &str) -> SqliteSettings {
    SqliteSettings {
        // put DB test files into a test directory (also works for in-memory)
        database_name: format!("test_output/{}.sqlite", db_name),
        init_sql: None,
    }
}

/// Generic setup method to help setup test enviroment
/// - sets up database (create one and initialises schema), drops existing database
/// - creates connection
/// - inserts mock data
pub async fn setup_all(
    db_name: &str,
    inserts: MockDataInserts,
) -> (
    MockDataCollection,
    StorageConnection,
    StorageConnectionManager,
    SqliteSettings,
) {
    setup_all_with_data(db_name, inserts, MockData::default()).await
}

pub async fn setup_all_with_data(
    db_name: &str,
    inserts: MockDataInserts,
    extra_mock_data: MockData,
) -> (
    MockDataCollection,
    StorageConnection,
    StorageConnectionManager,
    SqliteSettings,
) {
    let settings = get_test_db_settings(db_name);
    let connection_manager = setup(&settings).await;
    let connection = connection_manager.connection().unwrap();

    let core_data = insert_all_mock_data(&connection, inserts).await;
    insert_mock_data(
        &connection,
        MockDataInserts::all(),
        MockDataCollection {
            data: vec![("extra_data".to_string(), extra_mock_data)],
        },
    )
    .await;
    (core_data, connection, connection_manager, settings)
}

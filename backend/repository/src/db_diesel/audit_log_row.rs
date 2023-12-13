use super::{audit_log_row::audit_log::dsl as audit_log_dsl, StorageConnection};

use crate::repository_error::RepositoryError;

use chrono::NaiveDateTime;
use diesel::prelude::*;
use diesel_derive_enum::DbEnum;

table! {
    audit_log (id) {
        id -> Text,
        record_type -> crate::db_diesel::audit_log_row::LogTypeMapping,
        user_id -> Nullable<Text>,
        record_id -> Nullable<Text>,
        datetime -> Timestamp,
    }
}

#[derive(DbEnum, Debug, Clone, PartialEq, Eq)]
#[DbValueStyle = "SCREAMING_SNAKE_CASE"]
pub enum LogType {
    UserLoggedIn,
    UserAccountCreated,
    UserAccountUpdated,
    UserAccountPasswordResetInitiated,
}

#[derive(Clone, Queryable, Insertable, AsChangeset, Debug, PartialEq)]
#[changeset_options(treat_none_as_null = "true")]
#[table_name = "audit_log"]
pub struct AuditLogRow {
    pub id: String,
    pub record_type: LogType,
    pub user_id: Option<String>,
    pub record_id: Option<String>,
    pub datetime: NaiveDateTime,
}

pub struct AuditLogRowRepository<'a> {
    connection: &'a StorageConnection,
}

impl<'a> AuditLogRowRepository<'a> {
    pub fn new(connection: &'a StorageConnection) -> Self {
        AuditLogRowRepository { connection }
    }

    pub fn insert_one(&self, row: &AuditLogRow) -> Result<(), RepositoryError> {
        diesel::insert_into(audit_log_dsl::audit_log)
            .values(row)
            .execute(&self.connection.connection)?;
        Ok(())
    }

    pub fn find_one_by_id(&self, log_id: &str) -> Result<Option<AuditLogRow>, RepositoryError> {
        let result = audit_log_dsl::audit_log
            .filter(audit_log_dsl::id.eq(log_id))
            .first(&self.connection.connection)
            .optional()?;
        Ok(result)
    }
}

#[cfg(test)]
mod audit_log_row_repository_test {
    use chrono::NaiveDateTime;

    use crate::{test_db, AuditLogRow, AuditLogRowRepository, LogType};

    #[actix_rt::test]
    async fn test_audit_log_row_repository() {
        let settings = test_db::get_test_db_settings("test_audit_log_row_repository");
        let connection_manager = test_db::setup(&settings).await;
        let connection = connection_manager.connection().unwrap();

        let repo = AuditLogRowRepository::new(&connection);

        // Test insert_one
        let log1 = AuditLogRow {
            id: "log1".to_string(),
            record_type: LogType::UserLoggedIn,
            user_id: Some("c2ddbed6-548b-4aba-a505-34de7bb28708".to_string()),
            record_id: None,
            datetime: NaiveDateTime::from_timestamp_opt(2000, 0).unwrap(),
        };
        repo.insert_one(&log1).unwrap();
        let loaded_item = repo.find_one_by_id(log1.id.as_str()).unwrap().unwrap();
        assert_eq!(log1, loaded_item);

        // Test get one by id
        let result = repo.find_one_by_id("log1").unwrap().unwrap();
        assert!(result.id == "log1");
        assert!(result.user_id == Some("c2ddbed6-548b-4aba-a505-34de7bb28708".to_string()));
    }
}

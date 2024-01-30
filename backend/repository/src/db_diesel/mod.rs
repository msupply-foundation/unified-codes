// Disable Clippy unused_lifetimes as they are triggered by Diesel Macros such as `Insertable`
#![allow(clippy::extra_unused_lifetimes)]

use crate::repository_error::RepositoryError;

pub mod audit_log;
mod audit_log_row;
pub mod diesel_schema;
mod email_queue_row;
mod filter_sort_pagination;
pub mod key_value_store;

mod storage_connection;
pub mod user_account;
mod user_account_row;
pub mod user_permission;
mod user_permission_row;
pub use audit_log::*;
pub use audit_log_row::*;
pub use email_queue_row::*;
pub use filter_sort_pagination::*;
pub use key_value_store::*;
pub use storage_connection::*;
pub use user_account::*;
pub use user_account_row::*;
pub use user_permission::*;
pub use user_permission_row::*;

use diesel::{
    prelude::*,
    r2d2::{ConnectionManager, Pool, PooledConnection},
    result::{DatabaseErrorKind as DieselDatabaseErrorKind, Error as DieselError},
};

pub type DBBackendConnection = SqliteConnection;

pub type DBType = diesel::sqlite::Sqlite;

pub type DBConnection = PooledConnection<ConnectionManager<DBBackendConnection>>;

impl From<DieselError> for RepositoryError {
    fn from(err: DieselError) -> Self {
        use RepositoryError as Error;
        match err {
            DieselError::InvalidCString(extra) => {
                Error::as_db_error("DIESEL_INVALID_C_STRING", extra)
            }
            DieselError::DatabaseError(err, extra) => {
                let extra = format!("{:?}", extra);
                match err {
                    DieselDatabaseErrorKind::UniqueViolation => Error::UniqueViolation(extra),
                    DieselDatabaseErrorKind::ForeignKeyViolation => {
                        Error::ForeignKeyViolation(extra)
                    }
                    DieselDatabaseErrorKind::UnableToSendCommand => {
                        Error::as_db_error("UNABLE_TO_SEND_COMMAND", extra)
                    }
                    DieselDatabaseErrorKind::SerializationFailure => {
                        Error::as_db_error("SERIALIZATION_FAILURE", extra)
                    }
                    DieselDatabaseErrorKind::__Unknown => Error::as_db_error("UNKNOWN", extra),
                }
            }
            DieselError::NotFound => RepositoryError::NotFound,
            DieselError::QueryBuilderError(extra) => {
                Error::as_db_error("DIESEL_QUERY_BUILDER_ERROR", extra)
            }
            DieselError::DeserializationError(extra) => {
                Error::as_db_error("DIESEL_DESERIALIZATION_ERROR", extra)
            }
            DieselError::SerializationError(extra) => {
                Error::as_db_error("DIESEL_SERIALIZATION_ERROR", extra)
            }
            DieselError::RollbackTransaction => {
                Error::as_db_error("DIESEL_ROLLBACK_TRANSACTION", "")
            }
            DieselError::AlreadyInTransaction => {
                Error::as_db_error("DIESEL_ALREADY_IN_TRANSACTION", "")
            }
            _ => {
                // try to get a more detailed diesel msg:
                let diesel_msg = format!("{}", err);
                Error::as_db_error("DIESEL_UNKNOWN", diesel_msg)
            }
        }
    }
}

fn get_connection(
    pool: &Pool<ConnectionManager<DBBackendConnection>>,
) -> Result<PooledConnection<ConnectionManager<DBBackendConnection>>, RepositoryError> {
    pool.get().map_err(|error| RepositoryError::DBError {
        msg: "Failed to open Connection".to_string(),
        extra: format!("{:?}", error),
    })
}

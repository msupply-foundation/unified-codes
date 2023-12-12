use chrono::NaiveDateTime;
use repository::{
    AuditLog, AuditLogFilter, AuditLogRepository, AuditLogRow, AuditLogRowRepository, AuditLogSort,
    LogType, StorageConnectionManager,
};
use repository::{PaginationOption, RepositoryError};
use util::i64_to_u32;
use util::uuid::uuid;

use crate::service_provider::ServiceContext;

use super::{get_default_pagination, ListError, ListResult};

pub const MAX_LIMIT: u32 = 1000;
pub const MIN_LIMIT: u32 = 1;

pub fn get_logs(
    connection_manager: &StorageConnectionManager,
    pagination: Option<PaginationOption>,
    filter: Option<AuditLogFilter>,
    sort: Option<AuditLogSort>,
) -> Result<ListResult<AuditLog>, ListError> {
    let pagination = get_default_pagination(pagination, MAX_LIMIT, MIN_LIMIT)?;
    let connection = connection_manager.connection()?;
    let repository = AuditLogRepository::new(&connection);

    Ok(ListResult {
        rows: repository.query(pagination, filter.clone(), sort)?,
        count: i64_to_u32(repository.count(filter)?),
    })
}

pub fn audit_log_entry(
    ctx: &ServiceContext,
    log_type: LogType,
    record_id: Option<String>,
    datetime: NaiveDateTime,
) -> Result<(), RepositoryError> {
    let log = &AuditLogRow {
        id: uuid(),
        record_type: log_type,
        user_id: if ctx.user_id != "" {
            Some(ctx.user_id.clone())
        } else {
            None
        },
        record_id,
        datetime,
    };

    Ok(AuditLogRowRepository::new(&ctx.connection).insert_one(log)?)
}

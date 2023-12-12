use super::{
    audit_log_row::{audit_log, audit_log::dsl as audit_log_dsl},
    AuditLogRow, DBType, StorageConnection,
};
use diesel::prelude::*;

use crate::{
    diesel_macros::{apply_equal_filter, apply_sort_no_case},
    repository_error::RepositoryError,
    LogType,
};

use crate::{EqualFilter, Pagination, Sort};

#[derive(PartialEq, Debug, Clone)]
pub struct AuditLog {
    pub log_row: AuditLogRow,
}

#[derive(Clone, PartialEq, Debug)]
pub struct AuditLogFilter {
    pub id: Option<EqualFilter<String>>,
    pub record_type: Option<EqualFilter<LogType>>,
    pub user_id: Option<EqualFilter<String>>,
    pub record_id: Option<EqualFilter<String>>,
}

#[derive(PartialEq, Debug)]
pub enum AuditLogSortField {
    Id,
    LogType,
    UserId,
    RecordId,
    Datetime,
}

pub type AuditLogSort = Sort<AuditLogSortField>;

pub struct AuditLogRepository<'a> {
    connection: &'a StorageConnection,
}

impl<'a> AuditLogRepository<'a> {
    pub fn new(connection: &'a StorageConnection) -> Self {
        AuditLogRepository { connection }
    }

    pub fn count(&self, filter: Option<AuditLogFilter>) -> Result<i64, RepositoryError> {
        let query = create_filtered_query(filter);
        Ok(query.count().get_result(&self.connection.connection)?)
    }

    pub fn query_by_filter(
        &self,
        filter: AuditLogFilter,
    ) -> Result<Vec<AuditLog>, RepositoryError> {
        self.query(Pagination::new(), Some(filter), None)
    }

    pub fn query(
        &self,
        pagination: Pagination,
        filter: Option<AuditLogFilter>,
        sort: Option<AuditLogSort>,
    ) -> Result<Vec<AuditLog>, RepositoryError> {
        let mut query = create_filtered_query(filter);
        if let Some(sort) = sort {
            match sort.key {
                AuditLogSortField::Id => {
                    apply_sort_no_case!(query, sort, audit_log_dsl::id)
                }
                AuditLogSortField::LogType => {
                    apply_sort_no_case!(query, sort, audit_log_dsl::record_type)
                }
                AuditLogSortField::UserId => {
                    apply_sort_no_case!(query, sort, audit_log_dsl::user_id)
                }
                AuditLogSortField::RecordId => {
                    apply_sort_no_case!(query, sort, audit_log_dsl::record_id)
                }
                AuditLogSortField::Datetime => {
                    apply_sort_no_case!(query, sort, audit_log_dsl::datetime)
                }
            }
        } else {
            query = query.order(audit_log_dsl::datetime.asc())
        }

        let result = query
            .offset(pagination.offset as i64)
            .limit(pagination.limit as i64)
            .load::<AuditLogRow>(&self.connection.connection)?;

        Ok(result.into_iter().map(to_domain).collect())
    }
}

type BoxedLogQuery = audit_log::BoxedQuery<'static, DBType>;

fn create_filtered_query(filter: Option<AuditLogFilter>) -> BoxedLogQuery {
    let mut query = audit_log::table.into_boxed();

    if let Some(filter) = filter {
        apply_equal_filter!(query, filter.id, audit_log_dsl::id);
        apply_equal_filter!(query, filter.record_type, audit_log_dsl::record_type);
        apply_equal_filter!(query, filter.user_id, audit_log_dsl::user_id);
        apply_equal_filter!(query, filter.record_id, audit_log_dsl::record_id);
    }

    query
}

pub fn to_domain(log_row: AuditLogRow) -> AuditLog {
    AuditLog { log_row }
}

impl AuditLogFilter {
    pub fn new() -> AuditLogFilter {
        AuditLogFilter {
            id: None,
            record_type: None,
            user_id: None,
            record_id: None,
        }
    }

    pub fn id(mut self, filter: EqualFilter<String>) -> Self {
        self.id = Some(filter);
        self
    }

    pub fn record_type(mut self, filter: EqualFilter<LogType>) -> Self {
        self.record_type = Some(filter);
        self
    }

    pub fn user_id(mut self, filter: EqualFilter<String>) -> Self {
        self.user_id = Some(filter);
        self
    }

    pub fn record_id(mut self, filter: EqualFilter<String>) -> Self {
        self.record_id = Some(filter);
        self
    }
}

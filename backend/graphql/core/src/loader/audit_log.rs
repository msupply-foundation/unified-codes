use repository::{AuditLog, AuditLogFilter, AuditLogRepository, StorageConnectionManager};
use repository::{EqualFilter, Pagination};

use async_graphql::dataloader::*;
use async_graphql::*;
use std::collections::HashMap;

pub struct AuditLogLoader {
    pub connection_manager: StorageConnectionManager,
}

#[async_trait::async_trait]
impl Loader<String> for AuditLogLoader {
    type Value = Vec<AuditLog>;
    type Error = async_graphql::Error;

    async fn load(
        &self,
        record_ids: &[String],
    ) -> Result<HashMap<String, Self::Value>, Self::Error> {
        let connection = self.connection_manager.connection()?;
        let repo = AuditLogRepository::new(&connection);
        let mut result_map: HashMap<String, Vec<AuditLog>> = HashMap::new();

        for record_id in record_ids {
            let audit_logs = repo.query(
                Pagination::all(),
                Some(AuditLogFilter::new().record_id(EqualFilter::equal_to(record_id))),
                None,
            )?;
            result_map.insert(record_id.to_string(), audit_logs);
        }
        Ok(result_map)
    }
}

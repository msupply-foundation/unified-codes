use repository::{EqualFilter, Pagination, UserPermissionFilter, UserPermissionRepository};
use repository::{Permission, StorageConnectionManager};

use async_graphql::dataloader::*;
use async_graphql::*;
use std::collections::HashMap;

pub struct UserPermissionLoader {
    pub connection_manager: StorageConnectionManager,
}

#[async_trait::async_trait]
impl Loader<String> for UserPermissionLoader {
    type Value = Vec<Permission>;
    type Error = async_graphql::Error;

    async fn load(&self, user_ids: &[String]) -> Result<HashMap<String, Self::Value>, Self::Error> {
        let connection = self.connection_manager.connection()?;
        let repo = UserPermissionRepository::new(&connection);
        let result = repo.query(
            Pagination::all(),
            Some(UserPermissionFilter::new().user_id(EqualFilter::equal_any(user_ids.to_vec()))),
            None,
        )?;

        let mut result_map: HashMap<String, Vec<Permission>> = HashMap::new();

        for row in result {
            let entry = result_map.entry(row.user_id.clone()).or_insert(Vec::new());
            entry.push(row.permission);
        }

        Ok(result_map)
    }
}

use repository::StorageConnectionManager;
use repository::{EqualFilter, Pagination, UserAccount, UserAccountFilter, UserAccountRepository};

use async_graphql::dataloader::*;
use async_graphql::*;
use std::collections::HashMap;

pub struct UserLoader {
    pub connection_manager: StorageConnectionManager,
}

#[async_trait::async_trait]
impl Loader<String> for UserLoader {
    type Value = UserAccount;
    type Error = async_graphql::Error;

    async fn load(&self, user_ids: &[String]) -> Result<HashMap<String, Self::Value>, Self::Error> {
        let connection = self.connection_manager.connection()?;
        let repo = UserAccountRepository::new(&connection);
        Ok(repo
            .query(
                Pagination::all(),
                Some(UserAccountFilter::new().id(EqualFilter::equal_any(user_ids.to_vec()))),
                None,
            )?
            .into_iter()
            .map(|user| (user.id.clone(), user))
            .collect())
    }
}

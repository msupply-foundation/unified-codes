use rand::prelude::*;
use std::usize;

use gql_client::{Client, GraphQLError};
use serde::{Deserialize, Serialize};

// Dgraph sometimes returns an error like this:
// {"errors":[{"message":"Transaction has been aborted. Please retry","locations":[{"line":2,"column":3}],"extensions":{"code":"Error"}}],"data":null}
// Seems to mostly happen in tests, but in case this happens in production we'll retry a few times
// Sounds like this could possibly be to do with updating the same index?
const DEFAULT_RETRIES: usize = 3;
const DEFAULT_RETRY_DELAY: u64 = 20;

#[derive(Clone)]
pub struct DgraphClient {
    pub gql: Client,
    pub retries: usize,
    pub retry_delay: u64,
}

impl DgraphClient {
    pub fn new(url: &str) -> Self {
        DgraphClient {
            gql: Client::new(url),
            retries: DEFAULT_RETRIES,
            retry_delay: DEFAULT_RETRY_DELAY,
        }
    }

    pub async fn query_with_retry<K, T: Serialize + Clone>(
        &self,
        query: &str,
        variables: T,
    ) -> Result<Option<K>, GraphQLError>
    where
        K: for<'de> Deserialize<'de>,
    {
        let mut attempts = 0;
        while attempts < self.retries {
            let result = self
                .gql
                .query_with_vars::<K, T>(&query, variables.clone())
                .await;
            match result {
                Ok(result) => return Ok(result),
                Err(err) => {
                    attempts += 1;

                    if attempts >= self.retries {
                        // Retries are done, time to give up
                        // Return the actual error if there is one...
                        return Err(err);
                    }
                    log::error!("Query failed, retrying - {:#?} : {:#?}", query, err);
                    // Delay for a bit before retrying
                    let delay = rand::thread_rng().gen_range(1..self.retry_delay);
                    tokio::time::sleep(tokio::time::Duration::from_millis(delay)).await;
                    continue;
                }
            };
        }
        Err(GraphQLError::with_text(format!(
            "Query failed after {} attempts",
            attempts
        )))
    }
}

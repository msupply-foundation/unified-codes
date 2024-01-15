use gql_client::GraphQLError;
use serde::{Deserialize, Serialize};

use crate::{DgraphClient, PendingChangeInput};

#[derive(Serialize, Debug, Clone)]
struct UpsertVars {
    input: PendingChangeInput,
    upsert: bool,
}

#[allow(non_snake_case)]
#[derive(Deserialize, Debug, Clone)]
pub struct AddResponseData {
    pub data: AddResponse,
}

#[allow(non_snake_case)]
#[derive(Deserialize, Debug, Clone)]
pub struct AddResponse {
    pub numUids: u32,
}

// Dgraph sometimes returns an error like this:
// {"errors":[{"message":"Transaction has been aborted. Please retry","locations":[{"line":2,"column":3}],"extensions":{"code":"Error"}}],"data":null}
// Seems to mostly happen in tests, but in case this happens in production we'll retry a few times
// Sounds like this could possibly be to do with updating the same index? X-Dgraph-IgnoreIndexConflict?
const RETRIES: u32 = 3;

pub async fn upsert_pending_change(
    client: &DgraphClient,
    pending_change: PendingChangeInput,
    upsert: bool,
) -> Result<AddResponse, GraphQLError> {
    let query = r#"
mutation UpsertPendingChange($input: [AddPendingChangeInput!]!, $upsert: Boolean = false) {
  data: addPendingChange(input: $input, upsert: $upsert) {
    numUids
  }
}"#;
    let variables = UpsertVars {
        input: pending_change,
        upsert,
    };

    let mut attempts = 0;
    while attempts < RETRIES {
        let result = client
            .gql
            .query_with_vars::<AddResponseData, UpsertVars>(&query, variables.clone())
            .await;

        let result = match result {
            Ok(result) => result,
            Err(err) => {
                attempts += 1;

                if attempts >= RETRIES {
                    return Err(err);
                }
                log::error!(
                    "upsert_pending_change failed, retrying: {:#?} {:#?}",
                    attempts,
                    variables
                );
                continue;
            }
        };

        match result {
            Some(result) => {
                return Ok(AddResponse {
                    numUids: result.data.numUids,
                })
            }
            None => return Ok(AddResponse { numUids: 0 }),
        };
    }
    Err(GraphQLError::with_text(format!(
        "upsert_pending_change failed after {} retries",
        RETRIES
    )))
}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod tests {

    use util::uuid::uuid;

    use crate::{pending_change, ChangeType};

    use super::*;

    #[tokio::test]
    async fn test_upsert_pending_change() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let request_id = uuid();

        let pending_change_input = PendingChangeInput {
            request_id: request_id.clone(),
            body: "[some string array of new nodes]".to_string(),
            name: "new name".to_string(),
            category: "test_category".to_string(),
            change_type: ChangeType::New,
            ..Default::default()
        };

        let result = upsert_pending_change(&client, pending_change_input, true).await;
        if result.is_err() {
            println!(
                "upsert_pending_change err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());
        let result = result.unwrap();
        assert_eq!(result.numUids, 1);

        // Query for the new change
        let result = pending_change(&client, request_id).await;
        let res = result.unwrap().unwrap();

        assert_eq!(res.name, "new name".to_string());

        // TODO: Delete new pending change from dgraph
    }
}

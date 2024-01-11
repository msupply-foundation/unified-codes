use gql_client::GraphQLError;
use serde::{Deserialize, Serialize};

use crate::{DgraphClient, PendingChangeInput};

#[derive(Serialize, Debug, Clone)]
struct AddVars {
    input: PendingChangeInput,
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

pub async fn add_pending_change(
    client: &DgraphClient,
    pending_change: PendingChangeInput,
) -> Result<AddResponse, GraphQLError> {
    let query = r#"
mutation AddPendingChange($input: [AddPendingChangeInput!]!) {
  data: addPendingChange(input: $input) {
    numUids
  }
}"#;
    let variables = AddVars {
        input: pending_change,
    };

    let mut attempts = 0;
    while attempts < RETRIES {
        let result = client
            .gql
            .query_with_vars::<AddResponseData, AddVars>(&query, variables.clone())
            .await;

        let result = match result {
            Ok(result) => result,
            Err(err) => {
                attempts += 1;

                if attempts >= RETRIES {
                    return Err(err);
                }
                log::error!(
                    "add_pending_change failed, retrying: {:#?} {:#?}",
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
        "add_pending_change failed after {} retries",
        RETRIES
    )))
}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod tests {

    use util::uuid::uuid;

    use crate::pending_change;

    use super::*;

    #[tokio::test]
    async fn test_add_pending_change() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let request_id = uuid();

        let pending_change_input = PendingChangeInput {
            request_id: request_id.clone(),
            body: "[some string array of new nodes]".to_string(),
            name: "new name".to_string(),
            category: "test_category".to_string(),
            change_type: "New".to_string(),
            ..Default::default()
        };

        let result = add_pending_change(&client, pending_change_input).await;
        if result.is_err() {
            println!(
                "add_pending_change err: {:#?} {:#?}",
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
    }
}

use gql_client::GraphQLError;
use serde::{Deserialize, Serialize};

use crate::{DgraphClient, PendingChangePatch};

#[derive(Serialize, Debug, Clone)]
struct UpdateVars {
    request_id: String,
    set: PendingChangePatch,
}

#[allow(non_snake_case)]
#[derive(Deserialize, Debug, Clone)]
pub struct UpdateResponseData {
    pub data: UpdateResponse,
}

#[allow(non_snake_case)]
#[derive(Deserialize, Debug, Clone)]
pub struct UpdateResponse {
    pub numUids: u32,
}

// Dgraph sometimes returns an error like this:
// {"errors":[{"message":"Transaction has been aborted. Please retry","locations":[{"line":2,"column":3}],"extensions":{"code":"Error"}}],"data":null}
// Seems to mostly happen in tests, but in case this happens in production we'll retry a few times
// Sounds like this could possibly be to do with updating the same index? X-Dgraph-IgnoreIndexConflict?
const RETRIES: u32 = 3;

pub async fn update_pending_change(
    client: &DgraphClient,
    request_id: String,
    pending_change: PendingChangePatch,
) -> Result<UpdateResponse, GraphQLError> {
    let query = r#"
mutation UpdatePendingChange($request_id: String!, $set: PendingChangePatch!) {
  data: updatePendingChange(input: {
    filter: { request_id: { eq: $request_id } },
    set: $set
  }) {
    numUids
  }
}"#;
    let variables = UpdateVars {
        set: pending_change,
        request_id,
    };

    let mut attempts = 0;
    while attempts < RETRIES {
        let result = client
            .gql
            .query_with_vars::<UpdateResponseData, UpdateVars>(&query, variables.clone())
            .await;

        let result = match result {
            Ok(result) => result,
            Err(err) => {
                attempts += 1;

                if attempts >= RETRIES {
                    return Err(err);
                }
                log::error!(
                    "update_pending_change failed, retrying: {:#?} {:#?}",
                    attempts,
                    variables
                );
                continue;
            }
        };

        match result {
            Some(result) => {
                return Ok(UpdateResponse {
                    numUids: result.data.numUids,
                })
            }
            None => return Ok(UpdateResponse { numUids: 0 }),
        };
    }
    Err(GraphQLError::with_text(format!(
        "update_pending_change failed after {} retries",
        RETRIES
    )))
}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod tests {
    use util::uuid::uuid;

    use crate::{pending_change, upsert_pending_change, ChangeStatus, PendingChangeInput};

    use super::*;

    #[tokio::test]
    async fn test_update_pending_change() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let request_id = uuid();

        let pending_change_input = PendingChangeInput {
            request_id: request_id.clone(),
            status: ChangeStatus::Pending,
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
        let result = pending_change(&client, request_id.clone()).await;
        let res = result.unwrap().unwrap();

        assert_eq!(res.status, ChangeStatus::Pending);

        let result = update_pending_change(
            &client,
            request_id.clone(),
            PendingChangePatch {
                status: Some(ChangeStatus::Approved),
                ..Default::default()
            },
        )
        .await;
        if result.is_err() {
            println!(
                "update_pending_change err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());
        let result = result.unwrap();
        assert_eq!(result.numUids, 1);

        // Query for the new change
        let result = pending_change(&client, request_id.clone()).await;
        let res = result.clone().unwrap().unwrap();

        assert_eq!(res.status, ChangeStatus::Approved);

        // TODO: Delete from dgraph
    }
}

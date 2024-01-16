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

    let result = client
        .query_with_retry::<UpdateResponseData, UpdateVars>(&query, variables.clone())
        .await?;

    match result {
        Some(result) => {
            return Ok(UpdateResponse {
                numUids: result.data.numUids,
            })
        }
        None => return Ok(UpdateResponse { numUids: 0 }),
    };
}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod tests {
    use util::uuid::uuid;

    use crate::{add_pending_change, pending_change, ChangeStatus, PendingChangeInput};

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
    }
}

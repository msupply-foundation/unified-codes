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

    let result = client
        .query_with_retry::<AddResponseData, AddVars>(&query, variables.clone())
        .await?;

    match result {
        Some(result) => {
            return Ok(AddResponse {
                numUids: result.data.numUids,
            })
        }
        None => return Ok(AddResponse { numUids: 0 }),
    };
}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod tests {

    use util::uuid::uuid;

    use crate::{
        pending_change, update_pending_change, ChangeStatus, ChangeType, PendingChangePatch,
    };

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
            change_type: ChangeType::New,
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

        assert_eq!(res.name, "new name".to_string());

        // TODO: A better way to remove new pending change from dgraph
        // marking as rejected so as not to show up in PendingChange queries
        let _result = update_pending_change(
            &client,
            request_id.clone(),
            PendingChangePatch {
                status: Some(ChangeStatus::Rejected),
                ..Default::default()
            },
        )
        .await;
    }
}

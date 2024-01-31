use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DeleteResponse, DeleteResponseData, DgraphClient};

#[derive(Serialize, Debug, Clone)]
struct DeleteVars {
    group_id: String,
}

pub async fn delete_interaction_group(
    client: &DgraphClient,
    interaction_group_id: String,
) -> Result<DeleteResponse, GraphQLError> {
    let query = r#"
mutation DeleteConfigurationInput($group_id: String) {
  data: deleteDrugInteractionGroup(filter: {interaction_group_id: {eq: $group_id}}) {
    numUids
  }
}"#;
    let variables = DeleteVars {
        group_id: interaction_group_id,
    };

    let result = client
        .query_with_retry::<DeleteResponseData, DeleteVars>(&query, variables)
        .await?;

    match result {
        Some(result) => {
            return Ok(DeleteResponse {
                numUids: result.data.numUids,
            })
        }
        None => return Ok(DeleteResponse { numUids: 0 }),
    }
}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod tests {
    use util::uuid::uuid;

    use crate::insert_interaction_group::{
        insert_interaction_group, DrugCode, InteractionGroupInput,
    };

    use super::*;

    #[tokio::test]
    async fn test_delete_interaction_group() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let group_id = uuid();
        let group_name = "Diuretics".to_string();

        // Create a new Interaction Group
        let interaction_group = InteractionGroupInput {
            interaction_group_id: group_id.clone(),
            name: group_name.clone(),
            description: None,
            drugs: vec![DrugCode {
                code: "29a240ab".to_string(),
            }],
        };

        let result = insert_interaction_group(&client, interaction_group, false).await;
        if result.is_err() {
            println!(
                "insert_interaction_group err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());

        // Delete the interaction group
        let result = delete_interaction_group(&client, group_id).await;

        if result.is_err() {
            println!(
                "delete_interaction_group err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert_eq!(result.unwrap().numUids, 1);
    }
}

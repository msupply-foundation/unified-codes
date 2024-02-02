use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DeleteResponse, DeleteResponseData, DgraphClient};

#[derive(Serialize, Debug, Clone)]
struct DeleteVars {
    id: String,
}

pub async fn delete_interaction(
    client: &DgraphClient,
    interaction_id: String,
) -> Result<DeleteResponse, GraphQLError> {
    let query = r#"
mutation DeleteDrugInteraction($id: String) {
  data: deleteDrugInteraction(filter: {interaction_id: {eq: $id}}) {
    numUids
  }
}"#;
    let variables = DeleteVars { id: interaction_id };

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

    use crate::{
        delete_interaction::delete_interaction,
        insert_interaction::{insert_drug_interaction, DrugInteractionInput},
        DgraphClient, DrugCode, DrugInteractionSeverity,
    };

    #[tokio::test]
    async fn test_delete_interaction() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let interaction_id = uuid();

        // Create a new Interaction

        let interaction = DrugInteractionInput {
            interaction_id: interaction_id.clone(),
            name: interaction_id.clone(),
            severity: DrugInteractionSeverity::NothingExpected,
            description: "Some description here".to_string(),
            action: "None".to_string(),
            reference: "Reference".to_string(),
            drugs: vec![
                DrugCode {
                    code: "294d8414".to_string(),
                },
                DrugCode {
                    code: "294d8414".to_string(),
                },
            ],
            groups: vec![],
        };

        let result = insert_drug_interaction(&client, interaction, true).await;
        if result.is_err() {
            println!(
                "insert_drug_interaction err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());

        // Delete the interaction
        let result = delete_interaction(&client, interaction_id).await;

        if result.is_err() {
            println!(
                "delete_interaction err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert_eq!(result.unwrap().numUids, 1);
    }
}

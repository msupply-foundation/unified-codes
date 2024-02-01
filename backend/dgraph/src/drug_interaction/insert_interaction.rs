use gql_client::GraphQLError;
use serde::Serialize;

use crate::{
    DgraphClient, DrugCode, DrugInteractionSeverity, InteractionGroupRef, UpsertResponse,
    UpsertResponseData,
};

#[derive(Serialize, Debug, Clone)]
pub struct DrugInteractionInput {
    pub interaction_id: String,
    pub name: String,
    pub severity: DrugInteractionSeverity,
    pub description: String,
    pub action: String,
    pub reference: String,
    pub drugs: Vec<DrugCode>,
    pub groups: Vec<InteractionGroupRef>,
}

#[derive(Serialize, Debug, Clone)]
struct UpsertVars {
    input: DrugInteractionInput,
    upsert: bool,
}

pub async fn insert_drug_interaction(
    client: &DgraphClient,
    interaction: DrugInteractionInput,
    upsert: bool,
) -> Result<UpsertResponse, GraphQLError> {
    let query = r#"
mutation AddDrugInteraction($input: [AddDrugInteractionInput!]!, $upsert: Boolean = false) {
  data: addDrugInteraction(input: $input, upsert: $upsert) {
    numUids
  }
}"#;
    let variables = UpsertVars {
        input: interaction,
        upsert: upsert,
    };

    let result = client
        .query_with_retry::<UpsertResponseData, UpsertVars>(&query, variables)
        .await?;

    match result {
        Some(result) => {
            return Ok(UpsertResponse {
                numUids: result.data.numUids,
            })
        }
        None => return Ok(UpsertResponse { numUids: 0 }),
    }
}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod tests {
    use crate::delete_interaction::delete_interaction;
    use crate::delete_interaction_group::delete_interaction_group;
    use crate::insert_interaction_group::insert_interaction_group;
    use crate::insert_interaction_group::InteractionGroupInput;
    use crate::InteractionGroupRef;
    use util::uuid::uuid;

    use super::*;

    #[tokio::test]
    async fn test_insert_interaction() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let interaction_id = uuid();
        let interaction_group1_id = uuid();
        let interaction_group2_id = uuid();

        let interaction_name = "NSAIDs/ACE Inhibitors".to_string();

        // Create the first Interaction Group
        let interaction_group = InteractionGroupInput {
            interaction_group_id: interaction_group1_id.clone(),
            name: "NSAIDs".to_string(),
            description: Some("Non-steroidal anti-inflammatory drugs".to_string()),
            drugs: vec![DrugCode {
                code: "294d8414".to_string(),
            }],
        };

        let result = insert_interaction_group(&client, interaction_group, true).await;
        if result.is_err() {
            println!(
                "insert_interaction_group err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());

        // Create the second Interaction Group
        let interaction_group = InteractionGroupInput {
            interaction_group_id: interaction_group2_id.clone(),
            name: "ACE Inhibitors".to_string(),
            description: Some("Angiotensin-converting enzyme inhibitors".to_string()),
            drugs: vec![DrugCode {
                code: "ac07394b".to_string(),
            }],
        };

        let result = insert_interaction_group(&client, interaction_group, true).await;
        if result.is_err() {
            println!(
                "insert_interaction_group err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());

        // Create a new Interaction

        let interaction = DrugInteractionInput {
            interaction_id: interaction_id.clone(),
            name: interaction_name.clone(),
            severity: DrugInteractionSeverity::Severe,
            description: "NSAIDs may diminish the antihypertensive effect of ACE Inhibitors."
                .to_string(),
            action: "Monitor therapy".to_string(),
            reference:
                "https://www.drugs.com/drug-interactions/ace-inhibitors-with-nsaids-11-0-0-940-0"
                    .to_string(),
            drugs: vec![DrugCode {
                code: "294d8414".to_string(),
            }],
            groups: vec![
                InteractionGroupRef {
                    interaction_group_id: interaction_group1_id.clone(),
                },
                InteractionGroupRef {
                    interaction_group_id: interaction_group2_id.clone(),
                },
            ],
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

        // Clean up
        let result = delete_interaction_group(&client, interaction_group1_id.clone()).await;
        assert!(result.is_ok());
        let result = delete_interaction_group(&client, interaction_group2_id.clone()).await;
        assert!(result.is_ok());
        let result = delete_interaction(&client, interaction_id.clone()).await;
        assert!(result.is_ok());
    }
}

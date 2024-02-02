use gql_client::GraphQLError;
use serde::Serialize;

use crate::{
    DgraphClient, DrugCode, DrugInteractionSeverity, InteractionGroupRef, UpsertResponse,
    UpsertResponseData,
};

#[derive(Serialize, Debug, Clone)]
pub struct DrugInteractionUpdateInput {
    pub interaction_id: String,
    pub name: String,
    pub severity: DrugInteractionSeverity,
    pub description: String,
    pub action: String,
    pub reference: String,
    pub drugs_add: Vec<DrugCode>,
    pub drugs_remove: Vec<DrugCode>,
    pub groups_add: Vec<InteractionGroupRef>,
    pub groups_remove: Vec<InteractionGroupRef>,
}

#[derive(Serialize, Debug, Clone)]
struct DrugInteractionChange {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub severity: Option<DrugInteractionSeverity>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub action: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reference: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub drugs: Option<Vec<DrugCode>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub groups: Option<Vec<InteractionGroupRef>>,
}

#[derive(Serialize, Debug, Clone)]
struct DrugOrGroupList {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub drugs: Option<Vec<DrugCode>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub groups: Option<Vec<InteractionGroupRef>>,
}

#[derive(Serialize, Debug, Clone)]
struct UpdateVars {
    interaction_id: String,
    add: Option<DrugInteractionChange>,
    remove: Option<DrugOrGroupList>,
}

pub async fn update_drug_interaction(
    client: &DgraphClient,
    input: DrugInteractionUpdateInput,
) -> Result<UpsertResponse, GraphQLError> {
    let query = r#"
mutation UpdateDrugInteraction($interaction_id: String!, $add: DrugInteractionPatch, $remove: DrugInteractionPatch) {
    data: updateDrugInteraction(input: {filter: {interaction_id: {eq: $interaction_id}}, set: $add, remove: $remove}) {
        numUids
    }
    }"#;
    let variables = UpdateVars {
        interaction_id: input.interaction_id,
        add: Some(DrugInteractionChange {
            name: Some(input.name),
            description: Some(input.description),
            severity: Some(input.severity),
            action: Some(input.action),
            reference: Some(input.reference),
            drugs: match input.drugs_add.is_empty() {
                true => None,
                false => Some(input.drugs_add),
            },
            groups: match input.groups_add.is_empty() {
                true => None,
                false => Some(input.groups_add),
            },
        }),
        remove: if input.drugs_remove.is_empty() && input.groups_remove.is_empty() {
            None
        } else {
            Some(DrugOrGroupList {
                drugs: match input.drugs_remove.is_empty() {
                    true => None,
                    false => Some(input.drugs_remove),
                },
                groups: match input.groups_remove.is_empty() {
                    true => None,
                    false => Some(input.groups_remove),
                },
            })
        },
    };

    let result = client
        .query_with_retry::<UpsertResponseData, UpdateVars>(&query, variables)
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
    use util::uuid::uuid;

    use crate::delete_interaction::delete_interaction;
    use crate::delete_interaction_group::delete_interaction_group;
    use crate::insert_interaction::{insert_drug_interaction, DrugInteractionInput};
    use crate::insert_interaction_group::{insert_interaction_group, InteractionGroupInput};
    use crate::interaction::interaction_by_id;

    use super::*;

    #[tokio::test]
    async fn test_update_interaction() {
        let client = DgraphClient::new("http://localhost:8080/graphql");
        let interaction_id = uuid();
        let interaction_group1_id = uuid();
        let interaction_group2_id = uuid();

        let interaction_name = "UpdateInteractionTest".to_string();

        // Create the first Interaction Group
        let interaction_group = InteractionGroupInput {
            interaction_group_id: interaction_group1_id.clone(),
            name: "Group1".to_string(),
            description: Some("Description1".to_string()),
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
            name: "Group2".to_string(),
            description: Some("Description2".to_string()),
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
            description: "Interaction Description".to_string(),
            action: "Monitor therapy".to_string(),
            reference: "Reference".to_string(),
            drugs: vec![],
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

        // Try adding a drug and removing a group
        let interaction = DrugInteractionUpdateInput {
            interaction_id: interaction_id.clone(),
            name: interaction_name.clone(),
            severity: DrugInteractionSeverity::Severe,
            description: "Interaction Description".to_string(),
            action: "Monitor therapy".to_string(),
            reference: "Reference".to_string(),
            drugs_add: vec![DrugCode {
                code: "294d8414".to_string(),
            }],
            drugs_remove: vec![],
            groups_add: vec![],
            groups_remove: vec![InteractionGroupRef {
                interaction_group_id: interaction_group2_id.clone(),
            }],
        };

        let result = update_drug_interaction(&client, interaction.clone()).await;
        if result.is_err() {
            println!(
                "update_interaction(add/remove) err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());
        let interaction = interaction_by_id(&client, interaction_id.clone())
            .await
            .unwrap()
            .unwrap();

        assert!(interaction.drugs.len() == 1);
        assert_eq!(interaction.drugs[0].code, "294d8414");
        assert!(interaction.groups.len() == 1);
        assert_eq!(
            interaction.groups[0].interaction_group_id,
            interaction_group1_id
        );

        // Try removing a drug and adding a group
        let interaction = DrugInteractionUpdateInput {
            interaction_id: interaction_id.clone(),
            name: interaction_name.clone(),
            severity: DrugInteractionSeverity::Severe,
            description: "Interaction Description".to_string(),
            action: "Monitor therapy".to_string(),
            reference: "Reference".to_string(),
            drugs_add: vec![],
            drugs_remove: vec![DrugCode {
                code: "294d8414".to_string(),
            }],
            groups_add: vec![InteractionGroupRef {
                interaction_group_id: interaction_group2_id.clone(),
            }],
            groups_remove: vec![],
        };

        let result = update_drug_interaction(&client, interaction.clone()).await;
        if result.is_err() {
            println!(
                "update_interaction(remove/add) err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());
        let interaction = interaction_by_id(&client, interaction_id.clone())
            .await
            .unwrap()
            .unwrap();

        assert!(interaction.drugs.len() == 0);
        assert!(interaction.groups.len() == 2);

        // Clean up
        let result = delete_interaction_group(&client, interaction_group1_id.clone()).await;
        assert!(result.is_ok());
        let result = delete_interaction_group(&client, interaction_group2_id.clone()).await;
        assert!(result.is_ok());
        let result = delete_interaction(&client, interaction_id.clone()).await;
        assert!(result.is_ok());
    }
}

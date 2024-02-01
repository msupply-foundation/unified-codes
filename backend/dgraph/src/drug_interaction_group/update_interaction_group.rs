use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DgraphClient, DrugCode, UpsertResponse, UpsertResponseData};

#[derive(Serialize, Debug, Clone)]
pub struct InteractionGroupUpdateInput {
    pub interaction_group_id: String,
    pub name: String,
    pub description: Option<String>,
    pub drugs_add: Vec<DrugCode>,
    pub drugs_remove: Vec<DrugCode>,
}

#[derive(Serialize, Debug, Clone)]
struct InteractionGroupChange {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub drugs: Option<Vec<DrugCode>>,
}

#[derive(Serialize, Debug, Clone)]
struct DrugList {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub drugs: Option<Vec<DrugCode>>,
}

#[derive(Serialize, Debug, Clone)]
struct UpdateVars {
    group_id: String,
    add: Option<InteractionGroupChange>,
    remove: Option<DrugList>,
}

pub async fn update_interaction_group(
    client: &DgraphClient,
    group: InteractionGroupUpdateInput,
) -> Result<UpsertResponse, GraphQLError> {
    let query = r#"
mutation UpdateDrugInteractionGroup($group_id: String!, $add: DrugInteractionGroupPatch, $remove: DrugInteractionGroupPatch) {
    data: updateDrugInteractionGroup(input: {filter: {interaction_group_id: {eq: $group_id}}, set: $add, remove: $remove}) {
        numUids
    }
    }"#;
    let variables = UpdateVars {
        group_id: group.interaction_group_id,
        add: Some(InteractionGroupChange {
            name: Some(group.name),
            description: group.description,
            drugs: match group.drugs_add.is_empty() {
                true => None,
                false => Some(group.drugs_add),
            },
        }),
        remove: if group.drugs_remove.is_empty() {
            None
        } else {
            Some(DrugList {
                drugs: match group.drugs_remove.is_empty() {
                    true => None,
                    false => Some(group.drugs_remove),
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

    use crate::delete_interaction_group::delete_interaction_group;
    use crate::insert_interaction_group::{insert_interaction_group, InteractionGroupInput};
    use crate::interaction_groups::{interaction_groups, InteractionGroupFilter};
    use crate::update_interaction_group::update_interaction_group;

    use super::*;

    #[tokio::test]
    async fn test_update_interaction_group() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let group_id = uuid();
        let group_name = "ig_update_test".to_string();
        let group = InteractionGroupInput {
            interaction_group_id: group_id.clone(),
            name: group_name.clone(),
            description: Some("This is just for testing, please feel free to remove".to_string()),
            drugs: vec![],
        };

        let result = insert_interaction_group(&client, group.clone(), false).await;
        assert!(result.is_ok());

        // Try adding a drug
        let group = InteractionGroupUpdateInput {
            interaction_group_id: group_id.clone(),
            name: group_name.clone(),
            description: None,
            drugs_add: vec![DrugCode {
                code: "c7750265".to_string(),
            }],
            drugs_remove: vec![],
        };

        let result = update_interaction_group(&client, group.clone()).await;
        if result.is_err() {
            println!(
                "update_interaction_group(add) err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());

        // Check we have the right number of drugs in the record
        let groups = interaction_groups(
            &client,
            Some(InteractionGroupFilter {
                name: Some(group_name.clone()),
            }),
        )
        .await
        .unwrap()
        .unwrap();

        for group in groups.data {
            if group.interaction_group_id == group_id {
                assert_eq!(group.drugs.len(), 1);
                assert_eq!(group.drugs[0].code, "c7750265");
            }
        }

        // Try removing a drug
        let group = InteractionGroupUpdateInput {
            interaction_group_id: group_id.clone(),
            name: group_name.clone(),
            description: None,
            drugs_add: vec![],
            drugs_remove: vec![DrugCode {
                code: "c7750265".to_string(),
            }],
        };

        let result = update_interaction_group(&client, group.clone()).await;
        if result.is_err() {
            println!(
                "update_interaction_group(remove) err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());
        // Check we have the right number of drugs in the record
        let groups = interaction_groups(
            &client,
            Some(InteractionGroupFilter {
                name: Some(group_name.clone()),
            }),
        )
        .await
        .unwrap()
        .unwrap();

        for group in groups.data {
            if group.interaction_group_id == group_id {
                assert_eq!(group.drugs.len(), 0); // Should be no drugs now
            }
        }

        let result = delete_interaction_group(&client, group_id.clone()).await;
        assert!(result.is_ok());
    }
}

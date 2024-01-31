use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DgraphClient, UpsertResponse, UpsertResponseData};

#[derive(Serialize, Debug, Clone)]
pub struct DrugCode {
    pub code: String,
}

#[derive(Serialize, Debug, Clone)]
pub struct InteractionGroupInput {
    pub interaction_group_id: String,
    pub name: String,
    pub description: Option<String>,
    pub drugs: Vec<DrugCode>,
}

#[derive(Serialize, Debug, Clone)]
struct UpsertVars {
    input: InteractionGroupInput,
    upsert: bool,
}

pub async fn insert_interaction_group(
    client: &DgraphClient,
    group: InteractionGroupInput,
    upsert: bool,
) -> Result<UpsertResponse, GraphQLError> {
    let query = r#"
mutation AddInteractionGroup($input: [AddDrugInteractionGroupInput!]!, $upsert: Boolean = false) {
  data: addDrugInteractionGroup(input: $input, upsert: $upsert) {
    numUids
  }
}"#;
    let variables = UpsertVars {
        input: group,
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
    use util::uuid::uuid;

    use crate::delete_interaction_group::delete_interaction_group;
    use crate::interaction_groups::interaction_groups;
    use crate::interaction_groups::InteractionGroupFilter;

    use super::*;

    #[tokio::test]
    async fn test_insert_interaction_group() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let interaction_group_id = uuid();
        let group_name = "NSAIDs".to_string();

        // Create a new Interaction Group
        let interaction_group = InteractionGroupInput {
            interaction_group_id: interaction_group_id.clone(),
            name: group_name.clone(),
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

        // Check we can find the new record in the interaction group list
        let result = interaction_groups(
            &client,
            Some(InteractionGroupFilter {
                name: Some(group_name),
            }),
        )
        .await;
        if result.is_err() {
            println!(
                "interaction_groups err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        };
        let data = result.unwrap().unwrap();
        assert!(data.data.len() > 0);
        let mut found = false;
        for item in data.data {
            if item.interaction_group_id == interaction_group_id {
                found = true;
                // Delete the interaction group
                let result = delete_interaction_group(&client, interaction_group_id.clone()).await;
                if result.is_err() {
                    println!(
                        "delete_interaction_group err: {:#?} {:#?}",
                        result,
                        result.clone().unwrap_err().json()
                    );
                    assert!(false);
                }
                break;
            }
        }
        assert!(found);
    }
}

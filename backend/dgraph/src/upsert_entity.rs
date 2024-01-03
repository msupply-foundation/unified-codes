use gql_client::GraphQLError;
use serde::{Deserialize, Serialize};

use crate::{DgraphClient, EntityInput};

#[derive(Serialize, Debug)]
struct UpsertVars {
    input: EntityInput,
    upsert: bool,
}

#[allow(non_snake_case)]
#[derive(Deserialize, Debug, Clone)]
pub struct UpsertResponseData {
    pub data: UpsertResponse,
}

#[allow(non_snake_case)]
#[derive(Deserialize, Debug, Clone)]
pub struct UpsertResponse {
    pub numUids: u32,
}

pub async fn upsert_entity(
    client: &DgraphClient,
    entity: EntityInput,
) -> Result<UpsertResponse, GraphQLError> {
    let query = r#"
mutation UpdateEntity($input: [AddEntityInput!]!, $upsert: Boolean = false) {
  data: addEntity(input: $input, upsert: $upsert) {
    numUids
  }
}"#;
    let variables = UpsertVars {
        input: entity,
        upsert: true, // TODO: Maybe this should be passed in?
    };

    let result = client
        .gql
        .query_with_vars::<UpsertResponseData, UpsertVars>(&query, variables)
        .await?;

    match result {
        Some(result) => Ok(UpsertResponse {
            numUids: result.data.numUids,
        }),
        None => Ok(UpsertResponse { numUids: 0 }),
    }
}

#[cfg(test)]
mod tests {

    use util::uuid::uuid;

    use crate::{entity_by_code, PropertyInput};

    use super::*;

    #[tokio::test]
    async fn test_update_name_product() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let code_to_update = "13a83f706".to_string(); // Name: Tent

        // Get the entity
        let result = entity_by_code(&client, code_to_update.clone()).await;
        let original_entity = result.unwrap().unwrap();
        assert_eq!(original_entity.code, code_to_update.clone());
        assert_eq!(original_entity.name, "Tent".to_string());
        assert_eq!(original_entity.r#type, "Product".to_string());

        // Update name
        let entity_input = EntityInput {
            code: code_to_update.clone(),
            name: Some("new_name".to_string()),
            ..Default::default()
        };

        let result = upsert_entity(&client, entity_input).await;
        if result.is_err() {
            println!(
                "upsert_entity err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());
        // Get the updated entity
        let result = entity_by_code(&client, code_to_update.clone()).await;
        let e = result.unwrap().unwrap();
        assert_eq!(e.code, code_to_update.clone());
        assert_eq!(e.name, "new_name".to_string());

        // Reset name
        let entity_input = EntityInput {
            code: code_to_update.clone(),
            name: Some("Tent".to_string()), //Some(original_entity.name),
            ..Default::default()
        };
        let result = upsert_entity(&client, entity_input).await;
        assert!(result.is_ok());
        // Get the updated entity
        let result = entity_by_code(&client, code_to_update.clone()).await;
        let e = result.unwrap().unwrap();
        assert_eq!(e.code, code_to_update.clone());
        assert_eq!(e.name, "Tent".to_string());
    }

    #[tokio::test]
    async fn test_update_name_unit() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let code_to_update = "e4edcb00".to_string(); // Acetic Acid Topical Solution 2% 15mL

        // Get the entity
        let result = entity_by_code(&client, code_to_update.clone()).await;
        let original_entity = result.unwrap().unwrap();
        assert_eq!(original_entity.code, code_to_update.clone());
        assert_eq!(original_entity.name, "15mL".to_string());
        assert_eq!(original_entity.r#type, "Unit".to_string());

        // Update name
        let entity_input = EntityInput {
            code: code_to_update.clone(),
            name: Some("new_name".to_string()),
            ..Default::default()
        };

        let result = upsert_entity(&client, entity_input).await;
        if result.is_err() {
            println!(
                "upsert_entity err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());
        // Get the updated entity
        let result = entity_by_code(&client, code_to_update.clone()).await;
        let e = result.unwrap().unwrap();
        assert_eq!(e.code, code_to_update.clone());
        assert_eq!(e.name, "new_name".to_string());

        // Reset name
        let entity_input = EntityInput {
            code: code_to_update.clone(),
            name: Some(original_entity.name.clone()),
            ..Default::default()
        };
        let result = upsert_entity(&client, entity_input).await;
        assert!(result.is_ok());
        // Get the updated entity
        let result = entity_by_code(&client, code_to_update.clone()).await;
        let e = result.unwrap().unwrap();
        assert_eq!(e.code, code_to_update.clone());
        assert_eq!(e.name, original_entity.name);
    }

    #[tokio::test]
    async fn test_create_new_node() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let code_to_insert = uuid();

        // Create new node with properties
        let entity_input = EntityInput {
            code: code_to_insert.clone(),
            name: Some("new_name".to_string()),
            r#type: Some("test_type".to_string()),
            category: Some("test_category".to_string()),
            description: Some(code_to_insert.clone()), // Needs a unique description
            properties: Some(vec![
                PropertyInput {
                    key: "test_key1".to_string(),
                    value: "test_value1".to_string(),
                },
                PropertyInput {
                    key: "test_key2".to_string(),
                    value: "test_value2".to_string(),
                },
            ]),
            ..Default::default()
        };

        let result = upsert_entity(&client, entity_input).await;
        if result.is_err() {
            println!(
                "upsert_entity err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());
        let result = result.unwrap();
        assert_eq!(result.numUids, 3);

        // Get the updated entity
        let result = entity_by_code(&client, code_to_insert.clone()).await;
        let e = result.unwrap().unwrap();
        assert_eq!(e.code, code_to_insert.clone());
        assert_eq!(e.name, "new_name".to_string());
        assert_eq!(e.properties.len(), 2);
    }

    #[tokio::test]
    async fn test_create_new_node_with_child() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let code_to_insert = uuid();
        let child_code = uuid();

        // Create new node with properties
        let entity_input = EntityInput {
            code: code_to_insert.clone(),
            name: Some("new_name".to_string()),
            r#type: Some("test_type".to_string()),
            category: Some("test_category".to_string()),
            description: Some(code_to_insert.clone()), // Needs a unique description
            properties: None,
            children: Some(vec![EntityInput {
                code: child_code.clone(),
                name: Some("child_name".to_string()),
                r#type: Some("test_type".to_string()),
                category: Some("test_category".to_string()),
                description: Some(child_code.clone()), // Needs a unique description
                properties: Some(vec![
                    PropertyInput {
                        key: "test_key1".to_string(),
                        value: "test_value1".to_string(),
                    },
                    PropertyInput {
                        key: "test_key2".to_string(),
                        value: "test_value2".to_string(),
                    },
                ]),
                ..Default::default()
            }]),
            ..Default::default()
        };

        let result = upsert_entity(&client, entity_input).await;
        if result.is_err() {
            println!(
                "upsert_entity err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());
        let result = result.unwrap();
        assert_eq!(result.numUids, 4);

        // Get the updated entity
        let result = entity_by_code(&client, code_to_insert.clone()).await;
        let e = result.unwrap().unwrap();
        assert_eq!(e.code, code_to_insert.clone());
        assert_eq!(e.children.len(), 1);
        assert_eq!(e.children[0].code, child_code.clone());
        assert_eq!(e.children[0].properties.len(), 2);
    }
}

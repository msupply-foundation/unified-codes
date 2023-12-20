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

/*

    There are the following types in dgraph:
        DoseStrength
        PackImmediate
        Route
        FormQualifier
        Product
        Unit
        Category
        Form
        PackSize
    Each has an associated add<Type> graphql mutation.
*/

pub async fn upsert_entity(
    client: &DgraphClient,
    entity: EntityInput,
) -> Result<UpsertResponse, GraphQLError> {
    // Replace the {{type}} placeholder with the entity type to get the correct mutation
    let query = r#"
mutation UpdateEntity($input: [Add{{type}}Input!]!, $upsert: Boolean = false) {
  data: add{{type}}(input: $input, upsert: $upsert) {
    numUids
  }
}"#
    .replace("{{type}}", &entity.r#type);
    let variables = UpsertVars {
        input: entity,
        upsert: true,
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

    use crate::entity_by_code;

    use super::*;

    #[tokio::test]
    async fn test_update_name() {
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
            r#type: original_entity.r#type.clone(),
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
            r#type: original_entity.r#type,
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
}

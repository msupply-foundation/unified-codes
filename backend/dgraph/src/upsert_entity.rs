use gql_client::GraphQLError;
use serde::{Deserialize, Serialize};

use crate::{DgraphClient, Entity, EntityInput};

#[derive(Serialize, Debug)]
struct UpsertVars {
    input: EntityInput,
    upsert: bool,
}

#[derive(Deserialize, Debug, Clone)]
pub struct ProductEntity {
    pub product: Vec<Entity>,
}

#[allow(non_snake_case)]
#[derive(Deserialize, Debug, Clone)]
pub struct ProductData {
    pub data: ProductEntity,
    #[serde(default)]
    pub numUids: u32,
}

/*
{code: "abcd", category: "Drug", name: "Alphabetium", description: "Alphabetium", type: "Product"}
 */
pub async fn upsert_entity(
    client: &DgraphClient,
    entity: EntityInput,
) -> Result<Option<Entity>, GraphQLError> {
    let query = r#"
mutation UpdateProduct($input: [AddProductInput!]!, $upsert: Boolean = false) {
  data: addProduct(input: $input, upsert: $upsert) {
    numUids
    product {
     id
    code
    name
    description
    type
    }
  }
}"#;
    let variables = UpsertVars {
        input: entity,
        upsert: true,
    };

    let result = client
        .gql
        .query_with_vars::<ProductData, UpsertVars>(query, variables)
        .await?;

    match result {
        Some(result) => match result.data.product.first() {
            Some(entity) => Ok(Some(entity.clone())),
            None => Ok(None),
        },
        None => Ok(None),
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

        // Update name
        let entity_input = EntityInput {
            code: code_to_update.clone(),
            name: Some("new_name".to_string()),
            ..Default::default()
        };

        let result = upsert_entity(&client, entity_input).await;
        if result.is_err() {
            println!("{:#?}", result.clone().unwrap_err().json());
        }
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
        let e = result.unwrap().unwrap();
        assert_eq!(e.code, code_to_update.clone());
        assert_eq!(e.name, "Tent".to_string());
    }
}

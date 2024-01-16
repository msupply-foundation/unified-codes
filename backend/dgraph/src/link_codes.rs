use gql_client::GraphQLError;
use serde::{Deserialize, Serialize};

use crate::DgraphClient;

#[derive(Serialize, Debug, Clone)]
struct LinkCodesVars {
    parent: String,
    child: String,
}

#[allow(non_snake_case)]
#[derive(Deserialize, Debug, Clone)]
pub struct LinkResponseData {
    pub data: LinkResponse,
}

#[allow(non_snake_case)]
#[derive(Deserialize, Debug, Clone)]
pub struct LinkResponse {
    pub numUids: u32,
}

pub async fn link_entities(
    client: &DgraphClient,
    parent: String,
    child: String,
) -> Result<LinkResponse, GraphQLError> {
    let query = r#"
mutation LinkCodes($parent: String!, $child: String!) {
  data: updateEntity(
    input: {filter: {code: {eq: $parent}}, set: {children: {code: $child}}}
  ) {
    numUids
  }
}"#;
    let variables = LinkCodesVars { parent, child };

    let result = client
        .query_with_retry::<LinkResponseData, LinkCodesVars>(&query, variables)
        .await?;

    match result {
        Some(result) => Ok(LinkResponse {
            numUids: result.data.numUids,
        }),
        None => Ok(LinkResponse { numUids: 0 }),
    }
}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod tests {

    use util::uuid::uuid;

    use crate::{entity_by_code, upsert_entity, EntityInput};

    use super::*;

    #[tokio::test]
    async fn test_link_new_code() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        // Create a codes for parent and child
        let parent_code = uuid();
        // Create new node
        let entity_input = EntityInput {
            code: parent_code.clone(),
            name: Some("parent".to_string()),
            r#type: Some("test_type".to_string()),
            category: Some("test_category".to_string()),
            description: Some(parent_code.clone()), // Needs a unique description
            properties: None,
            children: None,
        };

        let result = upsert_entity(&client, entity_input, true).await;
        if result.is_err() {
            println!(
                "upsert_entity err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());
        let result = result.unwrap();
        assert_eq!(result.numUids, 1);

        // Create the child node
        let child_code = uuid();
        let entity_input = EntityInput {
            code: child_code.clone(),
            name: Some("child".to_string()),
            r#type: Some("test_type".to_string()),
            category: Some("test_category".to_string()),
            description: Some(child_code.clone()), // Needs a unique description
            properties: None,
            children: None,
        };

        let result = upsert_entity(&client, entity_input, true).await;
        if result.is_err() {
            println!(
                "upsert_entity err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());

        // Link the child to the parent
        let result = link_entities(&client, parent_code.clone(), child_code.clone()).await;
        if result.is_err() {
            println!(
                "link_entities err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());

        // Get the parent and check that it has the child
        let result = entity_by_code(&client, parent_code.clone()).await;
        let e = result.unwrap().unwrap();
        assert_eq!(e.code, parent_code.clone());
        assert_eq!(e.children.len(), 1);
        assert_eq!(e.children[0].code, child_code.clone());
    }
}

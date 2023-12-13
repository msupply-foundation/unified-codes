use gql_client::{Client, GraphQLError};
use serde::{Deserialize, Serialize};

use crate::DgraphClient;

#[allow(non_snake_case)]
#[derive(Deserialize, Debug)]
pub struct EntityData {
    pub queryEntity: Vec<Entity>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct Entity {
    pub id: String,
    pub code: String,
    pub description: String,
    #[serde(rename = "__typename")]
    pub r#type: String,
    #[serde(default)]
    pub properties: Vec<Properties>,
    #[serde(default)]
    pub children: Vec<Entity>,
}

#[derive(Serialize, Debug)]
pub struct Vars {
    search: String,
    first: u32,
    offset: u32,
}

#[derive(Serialize, Debug)]
pub struct CodeVars {
    code: String,
}

#[derive(Deserialize, Debug, Clone)]
pub struct Properties {
    #[serde(rename = "__typename")]
    pub key: String,
    pub value: String,
}

pub async fn entity_search(
    client: &DgraphClient,
    variables: Vars,
) -> Result<Option<EntityData>, GraphQLError> {
    let query = r#"
query EntitiesQuery($search: String = "", $first: Int = 10, $offset: Int = 0) {
  queryEntity(
    filter: {
      or: { code: { alloftext: $search } }
      description: { regexp: $search }
    }
    first: $first
    offset: $offset
  ) {
    __typename
    id
    code
    description
  }
}"#;
    let data = client
        .gql
        .query_with_vars::<EntityData, Vars>(query, variables)
        .await?;

    Ok(data)
}

pub async fn entity_by_code(
    client: &DgraphClient,
    code: String,
) -> Result<Option<Entity>, GraphQLError> {
    let query = r#"fragment Details on Entity {
  id
  code
  __typename
  type: __typename
  description
  properties {
    __typename
    type: __typename
    value
  }
}
query EntityQuery($code: String!) {
  queryEntity(filter: { code: { eq: $code } }) {
    ...Details
    children {
      ...Details
      children {
        ...Details
        children {
          ...Details
          children {
            ...Details
            children {
              ...Details
              children {
                ...Details
                children {
                  ...Details
                }
              }
            }
          }
        }
      }
    }
  }
}"#;
    let variables = CodeVars { code: code };

    let data = client
        .gql
        .query_with_vars::<EntityData, CodeVars>(query, variables)
        .await?;

    match data {
        Some(data) => match data.queryEntity.first() {
            Some(entity) => Ok(Some(entity.clone())),
            None => Ok(None),
        },
        None => Ok(None),
    }
}

#[cfg(test)]
mod tests {

    use super::*;

    #[tokio::test]
    async fn test_search() {
        let client = DgraphClient::new("http://localhost:8080/graphql");
        let variables = Vars {
            search: "/Heparin.Sodium.*/".to_string(),
            first: 10,
            offset: 0,
        };
        let result = entity_search(&client, variables).await;
        println!("{:#?}", result);
    }

    #[tokio::test]
    async fn test_entity_by_code() {
        let client = DgraphClient::new("http://localhost:8080/graphql");
        let result = entity_by_code(&client, "10808942".to_string()).await;
        println!("{:#?}", result);
        let e = result.unwrap().unwrap();
        assert_eq!(e.code, "10808942".to_string());
    }
}

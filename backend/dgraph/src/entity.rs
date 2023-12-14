use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DgraphClient, Entity, EntityData};

#[derive(Serialize, Debug)]
struct Vars {
    code: String,
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
    parents {
      ...Details
    }
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
    let variables = Vars { code: code };

    let data = client
        .gql
        .query_with_vars::<EntityData, Vars>(query, variables)
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
    async fn test_entity_by_code() {
        let client = DgraphClient::new("http://localhost:8080/graphql");
        let result = entity_by_code(&client, "10808942".to_string()).await;
        println!("{:#?}", result);
        let e = result.unwrap().unwrap();
        assert_eq!(e.code, "10808942".to_string());
    }
}

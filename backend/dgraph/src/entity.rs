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
  name
  description
  type
  __typename
  properties {
    __typename
    type
    value
  }
}
query EntityQuery($code: String!) {
  data: queryEntity(filter: { code: { eq: $code } }) {
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

    let result = client
        .gql
        .query_with_vars::<EntityData, Vars>(query, variables)
        .await?;

    match result {
        Some(result) => match result.data.first() {
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
        let e = result.unwrap().unwrap();
        assert_eq!(e.code, "10808942".to_string());
    }
}

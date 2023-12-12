use gql_client::{Client, GraphQLError};
use serde::{Deserialize, Serialize};
use std::error::Error;

#[derive(Deserialize, Debug)]
pub struct EntityData {
    queryEntity: Vec<Entity>,
}

#[derive(Deserialize, Debug)]
pub struct Entity {
    id: String,
    code: String,
    description: String,
}

#[derive(Serialize, Debug)]
pub struct Vars {
    search: String,
    first: u32,
    offset: u32,
}

async fn entity_search(variables: Vars) -> Result<Option<EntityData>, GraphQLError> {
    let client = Client::new("http://localhost:8080/graphql");
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
        .query_with_vars::<EntityData, Vars>(query, variables)
        .await?;

    Ok(data)
}

#[cfg(test)]
mod tests {

    use super::*;

    #[tokio::test]
    async fn test_gql() {
        let variables = Vars {
            search: "/Heparin.Sodium.*/".to_string(),
            first: 10,
            offset: 0,
        };
        let result = entity_search(variables).await;
        println!("{:#?}", result);
    }
}

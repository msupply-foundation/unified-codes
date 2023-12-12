use gql_client::{Client, GraphQLError};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
pub struct EntityData {
    pub queryEntity: Vec<Entity>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct Entity {
    pub id: String,
    pub code: String,
    pub description: String,
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

pub async fn entity_by_code(code: String) -> Result<Option<Entity>, GraphQLError> {
    let client = Client::new("http://localhost:8080/graphql");
    let query = r#"
query EntityQuery($code: String) {
  queryEntity(filter: {code: {eq: $code}}) {
     __typename
    id
    code
    description
  }
}"#;
    let variables = CodeVars { code: code };

    let data = client
        .query_with_vars::<EntityData, CodeVars>(query, variables)
        .await?;

    match data {
        Some(data) => match (data.queryEntity.first()) {
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
    async fn test_gql() {
        let variables = Vars {
            search: "/Heparin.Sodium.*/".to_string(),
            first: 10,
            offset: 0,
        };
        let result = entity_search(variables).await;
        println!("{:#?}", result);
    }

    #[tokio::test]
    async fn test_gql_by_code() {
        let result = entity_by_code("10808942".to_string()).await;
        println!("{:#?}", result);
    }
}

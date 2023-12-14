use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DgraphClient, EntityData};

#[derive(Serialize, Debug)]
pub struct SearchVars {
    search: String,
    first: u32,
    offset: u32,
}

pub async fn entity_search(
    client: &DgraphClient,
    variables: SearchVars,
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
        .query_with_vars::<EntityData, SearchVars>(query, variables)
        .await?;

    Ok(data)
}

#[cfg(test)]
mod tests {

    use super::*;

    #[tokio::test]
    async fn test_search() {
        let client = DgraphClient::new("http://localhost:8080/graphql");
        let variables = SearchVars {
            search: "/Heparin.Sodium.*/".to_string(),
            first: 10,
            offset: 0,
        };
        let result = entity_search(&client, variables).await;
        println!("{:#?}", result);
    }
}

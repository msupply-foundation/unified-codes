use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DgraphClient, EntityData};

#[derive(Serialize, Debug, Default)]
pub struct DgraphFilterType {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub regexp: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub eq: Option<String>,
}

#[derive(Serialize, Debug, Default)]
pub struct DgraphFilter {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub code: Option<DgraphFilterType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<DgraphFilterType>,
}

#[derive(Serialize, Debug)]
pub struct SearchVars {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub categories: Option<Vec<String>>,
    pub filter: DgraphFilter,
    pub first: Option<u32>,
    pub offset: Option<u32>,
}

pub async fn entities(
    client: &DgraphClient,
    variables: SearchVars,
) -> Result<Option<EntityData>, GraphQLError> {
    let query = r#"
query EntitiesQuery($categories: [String!], $filter: EntityFilter, $first: Int, $offset: Int) {
  data: queryEntity(filter: $filter first: $first offset: $offset) @cascade {
    parents(
      filter: {description: {in: $categories}}
    ) {
      id
      code
      name
      description
      __typename
    }
    id
    name
    description
    code
    __typename
  }
  aggregates: queryEntity(filter: {description: {in: $categories}}, first: $first, offset: $offset) @cascade {
      categories: childrenAggregate(filter: $filter) {
        count
      }
  	}
}
"#;
    let data = client
        .gql
        .query_with_vars::<EntityData, SearchVars>(query, variables)
        .await?;

    Ok(data)
}

#[cfg(test)]
mod tests {

    use std::vec;

    use super::*;

    #[tokio::test]
    async fn test_search() {
        let client = DgraphClient::new("http://localhost:8080/graphql");
        let variables = SearchVars {
            filter: DgraphFilter {
                description: Some(DgraphFilterType {
                    regexp: Some("/Heparin Sodium.*/".to_string()),
                    ..Default::default()
                }),
                ..Default::default()
            },
            first: Some(10),
            offset: Some(0),
            categories: Some(vec!["Drug".to_string()]),
        };
        let result = entities(&client, variables).await;
        if result.is_err() {
            println!("{:#?}", result.clone().unwrap_err().json());
        }
        // println!("{:#?}", result);
        let data = result.unwrap().unwrap();
        assert_eq!(data.data.len(), 1);
        assert_eq!(data.data[0].code, "10808942");
        assert_eq!(data.data[0].description, "Heparin Sodium");
        assert_eq!(data.aggregates.unwrap()[0].categories.count, 1);
    }
}

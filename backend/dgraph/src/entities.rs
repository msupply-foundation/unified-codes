use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DgraphClient, EntityData};

#[derive(Serialize, Debug, Default, Clone)]
pub struct DgraphFilterType {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub regexp: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub eq: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub r#in: Option<Vec<String>>,
}

#[derive(Serialize, Debug, Default, Clone)]
pub struct DgraphOrderByType {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub asc: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub desc: Option<String>,
}

#[derive(Serialize, Debug, Default, Clone)]
pub struct DgraphFilter {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub code: Option<DgraphFilterType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<DgraphFilterType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub alternative_names: Option<DgraphFilterType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub category: Option<DgraphFilterType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub r#type: Option<DgraphFilterType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub or: Option<Vec<DgraphFilter>>,
}

#[derive(Serialize, Debug)]
pub struct SearchVars {
    pub filter: DgraphFilter,
    pub first: Option<u32>,
    pub offset: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub order: Option<DgraphOrderByType>,
}

pub async fn entities(
    client: &DgraphClient,
    variables: SearchVars,
) -> Result<Option<EntityData>, GraphQLError> {
    let query = r#"
query EntitiesQuery($filter: EntityFilter, $first: Int, $offset: Int, $order: EntityOrder) {
  data: queryEntity(filter: $filter, first: $first, offset: $offset, order: $order ) {
    id
    name
    description
    type
    code
    alternative_names
    __typename
    properties {
        __typename
        code
        type
        value
    }
    parents {
        id
        name
        description
        type
        code
        alternative_names
        __typename
    }
  }
  aggregates: aggregateEntity(filter: $filter) {
    count
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
#[cfg(feature = "dgraph-tests")]
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
                category: Some(DgraphFilterType {
                    r#in: Some(vec!["Drug".to_string()]),
                    ..Default::default()
                }),
                r#type: Some(DgraphFilterType {
                    eq: Some("Product".to_string()),
                    ..Default::default()
                }),
                ..Default::default()
            },
            first: Some(10),
            offset: Some(0),
            order: None,
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
        assert_eq!(data.data[0].r#type, "Product");
        assert_eq!(data.aggregates.unwrap().count, 1);
        assert!(!data.properties.is_empty())
    }

    #[tokio::test]
    async fn test_search_desc() {
        let client = DgraphClient::new("http://localhost:8080/graphql");
        let variables = SearchVars {
            filter: DgraphFilter {
                description: Some(DgraphFilterType {
                    regexp: Some("/.*ace.*/".to_string()),
                    ..Default::default()
                }),
                category: Some(DgraphFilterType {
                    r#in: Some(vec!["Drug".to_string()]),
                    ..Default::default()
                }),
                r#type: Some(DgraphFilterType {
                    eq: Some("Product".to_string()),
                    ..Default::default()
                }),
                ..Default::default()
            },
            first: Some(2),
            offset: Some(0),
            order: Some(DgraphOrderByType {
                desc: Some("description".to_string()),
                ..Default::default()
            }),
        };
        let result = entities(&client, variables).await;
        if result.is_err() {
            println!("{:#?}", result.clone().unwrap_err().json());
        }
        // println!("{:#?}", result);
        let data = result.unwrap().unwrap();
        assert_eq!(data.data.len(), 2);
        assert_eq!(data.data[0].description, "Paracetamol");
        assert_eq!(data.data[1].description, "Nicotine replacement therapy");
    }

    #[tokio::test]
    async fn test_search_asc() {
        let client = DgraphClient::new("http://localhost:8080/graphql");
        let variables = SearchVars {
            filter: DgraphFilter {
                description: Some(DgraphFilterType {
                    regexp: Some("/.*ace.*/".to_string()),
                    ..Default::default()
                }),
                category: Some(DgraphFilterType {
                    r#in: Some(vec!["Drug".to_string()]),
                    ..Default::default()
                }),
                r#type: Some(DgraphFilterType {
                    eq: Some("Product".to_string()),
                    ..Default::default()
                }),
                ..Default::default()
            },
            first: Some(2),
            offset: Some(0),
            order: Some(DgraphOrderByType {
                asc: Some("description".to_string()),
                ..Default::default()
            }),
        };
        let result = entities(&client, variables).await;
        if result.is_err() {
            println!("{:#?}", result.clone().unwrap_err().json());
        }
        println!("{:#?}", result);
        let data = result.unwrap().unwrap();
        assert_eq!(data.data.len(), 2);
        assert_eq!(data.data[0].description, "Nicotine replacement therapy");
        assert_eq!(data.data[1].description, "Paracetamol");
    }
}

use gql_client::GraphQLError;
use serde::Deserialize;
use serde::Serialize;

use crate::DgraphClient;

#[derive(Deserialize, Debug, Clone)]
pub struct ConfigurationItem {
    pub code: String,
    pub name: String,
    pub r#type: String,
}

#[derive(Deserialize, Debug, Clone)]
pub struct ConfigurationItemData {
    pub data: Vec<ConfigurationItem>,
}

#[derive(Serialize, Debug)]
pub struct ConfigurationItemFilter {
    pub r#type: String,
}

pub async fn configuration_items(
    client: &DgraphClient,
    variables: ConfigurationItemFilter,
) -> Result<Option<ConfigurationItemData>, GraphQLError> {
    let query = r#"
query configurationItems($type: String) {
  data: queryConfigurationItem(filter: {type: {eq: $type}}) {
    name
    code
    type
    children {
        name
        code
        type
        children {
            name
            code
            type
      }
    }
  }
}
"#;
    let data = client
        .gql
        .query_with_vars::<ConfigurationItemData, ConfigurationItemFilter>(query, variables)
        .await?;

    Ok(data)
}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod tests {

    use super::*;

    #[tokio::test]
    async fn test_type_filter() {
        let client = DgraphClient::new("http://localhost:8080/graphql");
        let variables = ConfigurationItemFilter {
            r#type: "Route".to_string(),
        };
        let result = configuration_items(&client, variables).await;
        if result.is_err() {
            println!("{:#?}", result.clone().unwrap_err().json());
        }
        // println!("{:#?}", result);
        let data = result.unwrap().unwrap();
        // Note, this will fail if you haven't created any routes in dgraph
        assert!(data.data.len() > 0);
    }
}

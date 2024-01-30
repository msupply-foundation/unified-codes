use gql_client::GraphQLError;
use serde::Deserialize;

use crate::DgraphClient;

#[derive(Deserialize, Debug, Clone)]
pub struct PropertyConfigurationItem {
    pub id: String,
    pub url: String,
    pub label: String,
    pub r#type: String,
}

#[derive(Deserialize, Debug, Clone)]
pub struct PropertyConfigurationItemData {
    pub data: Vec<PropertyConfigurationItem>,
}

pub async fn property_configuration_items(
    client: &DgraphClient,
) -> Result<Option<PropertyConfigurationItemData>, GraphQLError> {
    let query = r#"
query propertyConfigurationItems {
  data: queryPropertyConfigurationItem {
    id
    label
    url
    type
  }
}
"#;
    let data = client
        .gql
        .query::<PropertyConfigurationItemData>(query)
        .await?;

    Ok(data)
}

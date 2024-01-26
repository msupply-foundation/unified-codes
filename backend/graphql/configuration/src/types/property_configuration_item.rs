use async_graphql::*;
use dgraph::property_configuration_items::PropertyConfigurationItem;
use service::configuration::PropertyConfigurationItemCollection;

#[derive(Clone, Debug)]
pub struct PropertyConfigurationItemNode {
    pub id: String,
    pub label: String,
    pub url: String,
    pub r#type: String,
}

impl PropertyConfigurationItemNode {
    pub fn from_domain(item: PropertyConfigurationItem) -> PropertyConfigurationItemNode {
        PropertyConfigurationItemNode {
            id: item.id,
            label: item.label,
            url: item.url,
            r#type: item.r#type,
        }
    }
}

#[Object]
impl PropertyConfigurationItemNode {
    pub async fn id(&self) -> &str {
        &self.id
    }
    pub async fn label(&self) -> &str {
        &self.label
    }
    pub async fn url(&self) -> &str {
        &self.url
    }
    pub async fn r#type(&self) -> &str {
        &self.r#type
    }
}

#[derive(Debug, SimpleObject)]
pub struct PropertyConfigurationItemConnector {
    pub data: Vec<PropertyConfigurationItemNode>,
    pub total_count: u32,
}

impl PropertyConfigurationItemConnector {
    pub fn from_domain(
        results: PropertyConfigurationItemCollection,
    ) -> PropertyConfigurationItemConnector {
        PropertyConfigurationItemConnector {
            total_count: results.total_length,
            data: results
                .data
                .into_iter()
                .map(PropertyConfigurationItemNode::from_domain)
                .collect(),
        }
    }
}

#[derive(Union)]
pub enum PropertyConfigurationItemsResponse {
    Response(PropertyConfigurationItemConnector),
}

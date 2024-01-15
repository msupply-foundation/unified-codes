use async_graphql::*;
use dgraph::configuration_items::ConfigurationItem;
use service::configuration::{ConfigurationItemCollection, ConfigurationType};

#[derive(Enum, Copy, Clone, PartialEq, Eq)]
#[graphql(rename_items = "snake_case")]
pub enum ConfigurationItemTypeInput {
    Route,
    Form,
    ImmediatePackaging,
}

impl ConfigurationItemTypeInput {
    pub fn to_domain(self) -> ConfigurationType {
        match self {
            ConfigurationItemTypeInput::Route => ConfigurationType::Route,
            ConfigurationItemTypeInput::Form => ConfigurationType::Form,
            ConfigurationItemTypeInput::ImmediatePackaging => ConfigurationType::ImmediatePackaging,
        }
    }
}

#[derive(Clone, Debug)]
pub struct ConfigurationItemNode {
    pub code: String,
    pub name: String,
    pub r#type: String,
}

impl ConfigurationItemNode {
    pub fn from_domain(item: ConfigurationItem) -> ConfigurationItemNode {
        ConfigurationItemNode {
            code: item.code,
            name: item.name,
            r#type: item.r#type,
        }
    }
}

#[Object]
impl ConfigurationItemNode {
    pub async fn id(&self) -> &str {
        &self.code
    }

    pub async fn code(&self) -> &str {
        &self.code
    }
    pub async fn name(&self) -> &str {
        &self.name
    }
    pub async fn r#type(&self) -> &str {
        &self.r#type
    }
}

#[derive(Debug, SimpleObject)]
pub struct ConfigurationItemConnector {
    pub data: Vec<ConfigurationItemNode>,
    pub total_count: u32,
}

impl ConfigurationItemConnector {
    pub fn from_domain(results: ConfigurationItemCollection) -> ConfigurationItemConnector {
        ConfigurationItemConnector {
            total_count: results.total_length,
            data: results
                .data
                .into_iter()
                .map(ConfigurationItemNode::from_domain)
                .collect(),
        }
    }
}

#[derive(Union)]
pub enum ConfigurationItemResponse {
    Response(ConfigurationItemNode),
}
#[derive(Union)]
pub enum ConfigurationItemsResponse {
    Response(ConfigurationItemConnector),
}

use async_graphql::*;
use service::configuration::{
    upsert::AddConfigurationItem, upsert_property::UpsertPropertyConfigurationItem,
};

use super::ConfigurationItemTypeInput;

#[derive(InputObject, Clone)]
pub struct AddConfigurationItemInput {
    pub name: String,
    pub r#type: ConfigurationItemTypeInput,
}

impl From<AddConfigurationItemInput> for AddConfigurationItem {
    fn from(input: AddConfigurationItemInput) -> Self {
        AddConfigurationItem {
            name: input.name,
            r#type: input.r#type.to_domain().to_string(),
        }
    }
}

#[derive(InputObject, Clone)]
pub struct UpsertPropertyConfigItemInput {
    pub label: String,
    pub url: String,
    pub r#type: String,
}

impl From<UpsertPropertyConfigItemInput> for UpsertPropertyConfigurationItem {
    fn from(input: UpsertPropertyConfigItemInput) -> Self {
        UpsertPropertyConfigurationItem {
            r#type: input.r#type,
            url: input.url,
            label: input.label,
        }
    }
}

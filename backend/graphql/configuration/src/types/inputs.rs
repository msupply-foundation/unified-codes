use async_graphql::*;
use service::configuration::upsert::AddConfigurationItem;

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

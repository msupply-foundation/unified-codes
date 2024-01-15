use std::{
    fmt::{Display, Formatter},
    sync::Arc,
};

use dgraph::{
    configuration_items::{configuration_items, ConfigurationItem, ConfigurationItemFilter},
    DgraphClient,
};
use util::usize_to_u32;

use crate::{service_provider::ServiceProvider, settings::Settings};

use self::upsert::ModifyConfigurationError;

pub mod delete;
mod tests;
pub mod upsert;

pub struct ConfigurationService {
    client: DgraphClient,
}

pub enum ConfigurationType {
    Route,
    Form,
    ImmediatePackaging,
    Test,
}

impl Display for ConfigurationType {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            ConfigurationType::Route => write!(f, "Route"),
            ConfigurationType::Form => write!(f, "Form"),
            ConfigurationType::ImmediatePackaging => write!(f, "ImmediatePackaging"),
            ConfigurationType::Test => write!(f, "test_type"),
        }
    }
}

#[derive(Debug)]
pub enum ConfigurationServiceError {
    InternalError(String),
    BadUserInput(String),
}

impl Display for ConfigurationServiceError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            ConfigurationServiceError::InternalError(details) => {
                write!(f, "Internal error: {}", details)
            }
            ConfigurationServiceError::BadUserInput(details) => {
                write!(f, "Bad user input: {}", details)
            }
        }
    }
}

pub struct ConfigurationItemCollection {
    pub data: Vec<ConfigurationItem>,
    pub total_length: u32,
}

impl ConfigurationService {
    pub fn new(settings: Settings) -> Self {
        let url = format!(
            "{}:{}/graphql",
            settings.dgraph.host.clone(),
            settings.dgraph.port
        );

        ConfigurationService {
            client: DgraphClient::new(&url),
        }
    }

    pub async fn configuration_items(
        &self,
        r#type: ConfigurationType,
    ) -> Result<ConfigurationItemCollection, ConfigurationServiceError> {
        let dgraph_vars = ConfigurationItemFilter {
            r#type: r#type.to_string(),
        };

        let result = configuration_items(&self.client, dgraph_vars)
            .await
            .map_err(|e| ConfigurationServiceError::InternalError(e.message().to_string()))?; // TODO: Improve error handling?

        match result {
            Some(data) => Ok(ConfigurationItemCollection {
                total_length: usize_to_u32(data.data.len()),
                data: data.data,
            }),
            None => Ok(ConfigurationItemCollection {
                data: vec![],
                total_length: 0,
            }),
        }
    }

    pub async fn add_configuration_item(
        &self,
        sp: Arc<ServiceProvider>,
        user_id: String,
        item: upsert::AddConfigurationItem,
    ) -> Result<u32, ModifyConfigurationError> {
        upsert::add_configuration_item(sp, user_id, self.client.clone(), item).await
    }

    pub async fn delete_configuration_item(
        &self,
        sp: Arc<ServiceProvider>,
        user_id: String,
        code: String,
    ) -> Result<u32, ModifyConfigurationError> {
        delete::delete_configuration_item(sp, user_id, self.client.clone(), code).await
    }
}

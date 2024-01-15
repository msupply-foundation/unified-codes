use std::sync::Arc;

use crate::{
    audit_log::audit_log_entry,
    service_provider::{ServiceContext, ServiceProvider},
};
use chrono::Utc;
use dgraph::insert_configuration_item::{insert_configuration_item, ConfigurationItemInput};
use dgraph::GraphQLError;
use repository::{LogType, RepositoryError};

#[derive(Debug)]
pub enum ModifyConfigurationError {
    InternalError(String),
    DatabaseError(RepositoryError),
    DgraphError(GraphQLError),
}

impl From<RepositoryError> for ModifyConfigurationError {
    fn from(error: RepositoryError) -> Self {
        ModifyConfigurationError::DatabaseError(error)
    }
}

impl From<GraphQLError> for ModifyConfigurationError {
    fn from(error: GraphQLError) -> Self {
        ModifyConfigurationError::DgraphError(error)
    }
}

#[derive(Clone, Debug)]
pub struct AddConfigurationItem {
    pub name: String,
    pub r#type: String,
}

pub async fn add_configuration_item(
    sp: Arc<ServiceProvider>,
    user_id: String,
    client: dgraph::DgraphClient,
    new_configuration_item: AddConfigurationItem,
) -> Result<u32, ModifyConfigurationError> {
    // Validate
    validate(&client, &new_configuration_item).await?;

    // Generate
    let item_input = generate(new_configuration_item.clone())?;

    let result = insert_configuration_item(&client, item_input.clone(), true).await?;

    // Audit logging
    let service_context = ServiceContext::with_user(sp.clone(), user_id)?;
    audit_log_entry(
        &service_context,
        LogType::ConfigurationItemCreated,
        Some(item_input.code),
        Utc::now().naive_utc(),
    )?;

    Ok(result.numUids)
}

pub fn generate(
    updated_item: AddConfigurationItem,
) -> Result<ConfigurationItemInput, ModifyConfigurationError> {
    Ok(ConfigurationItemInput {
        code: updated_item.name.clone(), // Using name as code for now, we might want to do some kind of linking later on...
        name: updated_item.name.clone(),
        r#type: updated_item.r#type.clone(),
    })
}

pub async fn validate(
    // ctx: &ServiceContext,
    _client: &dgraph::DgraphClient,
    new_item: &AddConfigurationItem,
) -> Result<(), ModifyConfigurationError> {
    if new_item.name.is_empty() {
        return Err(ModifyConfigurationError::InternalError(
            "Name is required".to_string(),
        ));
    }

    Ok(())
}

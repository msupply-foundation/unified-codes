use std::sync::Arc;

use crate::{
    audit_log::audit_log_entry,
    service_provider::{ServiceContext, ServiceProvider},
};
use chrono::Utc;
use dgraph::upsert_property_configuration_item::{
    upsert_property_config_item, PropertyConfigurationItemInput,
};
use repository::LogType;

use super::ModifyConfigurationError;

#[derive(Clone, Debug)]
pub struct UpsertPropertyConfigurationItem {
    pub label: String,
    pub url: String,
    pub r#type: String,
}

pub async fn upsert_property_configuration_item(
    sp: Arc<ServiceProvider>,
    user_id: String,
    client: dgraph::DgraphClient,
    updated_property_config_item: UpsertPropertyConfigurationItem,
) -> Result<u32, ModifyConfigurationError> {
    // Validate
    validate(&client, &updated_property_config_item).await?;

    // Generate
    let item_input = generate(updated_property_config_item.clone())?;

    let result = upsert_property_config_item(&client, item_input.clone(), true).await?;

    // Audit logging
    let service_context = ServiceContext::with_user(sp.clone(), user_id)?;
    audit_log_entry(
        &service_context,
        LogType::PropertyConfigurationItemUpserted,
        Some(item_input.r#type),
        Utc::now().naive_utc(),
    )?;

    Ok(result.numUids)
}

pub fn generate(
    updated_item: UpsertPropertyConfigurationItem,
) -> Result<PropertyConfigurationItemInput, ModifyConfigurationError> {
    Ok(PropertyConfigurationItemInput {
        r#type: updated_item.r#type.clone(),
        label: updated_item.label.clone(),
        url: updated_item.url.clone(),
    })
}

pub async fn validate(
    _client: &dgraph::DgraphClient,
    updated_item: &UpsertPropertyConfigurationItem,
) -> Result<(), ModifyConfigurationError> {
    if updated_item.r#type.is_empty() {
        return Err(ModifyConfigurationError::InternalError(
            "Type is required".to_string(),
        ));
    }

    if updated_item.label.is_empty() {
        return Err(ModifyConfigurationError::InternalError(
            "Label is required".to_string(),
        ));
    }

    Ok(())
}

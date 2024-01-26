use std::sync::Arc;

use crate::{
    audit_log::audit_log_entry,
    service_provider::{ServiceContext, ServiceProvider},
};
use chrono::Utc;
use dgraph::delete_configuration_item::delete_configuration_item as dgraph_delete_configuration_item;
use repository::LogType;

use super::ModifyConfigurationError;

pub async fn delete_configuration_item(
    sp: Arc<ServiceProvider>,
    user_id: String,
    client: dgraph::DgraphClient,
    code: String,
) -> Result<u32, ModifyConfigurationError> {
    let result = dgraph_delete_configuration_item(&client, code.clone()).await?;

    // Audit logging
    let service_context = ServiceContext::with_user(sp.clone(), user_id)?;
    audit_log_entry(
        &service_context,
        LogType::ConfigurationItemDeleted,
        Some(code),
        Utc::now().naive_utc(),
    )?;

    Ok(result.numUids)
}

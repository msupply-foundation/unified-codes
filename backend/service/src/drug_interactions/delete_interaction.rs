use std::sync::Arc;

use crate::{
    audit_log::audit_log_entry,
    service_provider::{ServiceContext, ServiceProvider},
};
use chrono::Utc;
use dgraph::delete_interaction::delete_interaction as dgraph_delete_interaction;
use repository::LogType;

use super::ModifyDrugInteractionError;

pub async fn delete_drug_interaction(
    sp: Arc<ServiceProvider>,
    user_id: String,
    client: dgraph::DgraphClient,
    code: String,
) -> Result<u32, ModifyDrugInteractionError> {
    let result = dgraph_delete_interaction(&client, code.clone()).await?;

    // Audit logging
    let service_context = ServiceContext::with_user(sp.clone(), user_id)?;
    audit_log_entry(
        &service_context,
        LogType::InteractionDeleted,
        Some(code),
        Utc::now().naive_utc(),
    )?;

    Ok(result.numUids)
}

use std::sync::Arc;

use crate::{
    audit_log::audit_log_entry,
    service_provider::{ServiceContext, ServiceProvider},
};
use chrono::Utc;
use dgraph::{pending_change, ChangeStatus, ChangeType, PendingChange, PendingChangeInput};
use repository::LogType;

use super::ModifyUniversalCodeError;

#[derive(Clone, Debug)]
pub struct AddPendingChange {
    pub request_id: String,
    pub name: String,
    pub category: String,
    pub body: String,
    pub change_type: ChangeType,
    pub requested_for: String,
}

pub async fn add_pending_change(
    sp: Arc<ServiceProvider>,
    user_id: String,
    client: dgraph::DgraphClient,
    pending_change_request: AddPendingChange,
) -> Result<PendingChange, ModifyUniversalCodeError> {
    // Validate
    let pending_change_request = validate(&pending_change_request).await?;

    // Generate
    let pending_change_input = generate(pending_change_request.clone(), user_id.clone())?;

    let _result = dgraph::add_pending_change(&client, pending_change_input.clone()).await?;

    let requested_change = pending_change(&client, pending_change_input.request_id)
        .await
        .map_err(|e| {
            ModifyUniversalCodeError::InternalError(format!(
                "Failed to get pending change by request id: {}",
                e.message()
            ))
        })?;

    let requested_change = match requested_change {
        Some(requested_change) => requested_change,
        None => {
            return Err(ModifyUniversalCodeError::InternalError(
                "Unable to find pending change".to_string(),
            ))
        }
    };

    // Audit logging
    let service_context = ServiceContext::with_user(sp.clone(), user_id)?;
    audit_log_entry(
        &service_context,
        LogType::UniversalCodeChangeRequested,
        Some(requested_change.request_id.clone()), // what should this be? Could be the code of the entity if its a change, but not if we're requesting to make a new one... request_id won't connect back to entity later - do we care?
        Utc::now().naive_utc(),
    )?;

    Ok(requested_change)
}

pub fn generate(
    change_request: AddPendingChange,
    user_id: String,
) -> Result<PendingChangeInput, ModifyUniversalCodeError> {
    println!("generate: {:?}", change_request);

    Ok(PendingChangeInput {
        request_id: change_request.request_id,
        name: change_request.name.clone(),
        category: change_request.category.clone(),
        body: change_request.body.clone(),
        change_type: change_request.change_type.clone(),
        requested_for: change_request.requested_for.clone(),

        status: ChangeStatus::Pending,
        date_requested: Utc::now().naive_utc(),
        requested_by_user_id: user_id.clone(),
    })
}

pub async fn validate(
    pending_change: &AddPendingChange,
) -> Result<AddPendingChange, ModifyUniversalCodeError> {
    // We could do a duplication check here... but would need to deserialise body to check each node

    // TODO check doesn't exist

    // TODO: allow empty if an update...
    if pending_change.name.clone().is_empty() {
        return Err(ModifyUniversalCodeError::InternalError(
            "Name is required".to_string(),
        ));
    }
    if pending_change.category.clone().is_empty() {
        return Err(ModifyUniversalCodeError::InternalError(
            "Category is required".to_string(),
        ));
    }
    // How much do we want to trust the contents of `body`?
    if pending_change.body.clone().is_empty() {
        return Err(ModifyUniversalCodeError::InternalError(
            "Body is required".to_string(),
        ));
    }
    if pending_change.requested_for.clone().is_empty() {
        return Err(ModifyUniversalCodeError::InternalError(
            "Requested For is required".to_string(),
        ));
    }

    Ok(pending_change.clone())
}

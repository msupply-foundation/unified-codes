use std::sync::Arc;

use crate::{
    audit_log::audit_log_entry,
    service_provider::{ServiceContext, ServiceProvider},
};
use chrono::Utc;
use dgraph::{
    pending_change, update_pending_change, ChangeStatus, PendingChange, PendingChangePatch,
};
use repository::LogType;

use super::{validate::check_pending_change_exists, ModifyUniversalCodeError};

pub async fn update_pending_change_body(
    sp: Arc<ServiceProvider>,
    user_id: String,
    client: dgraph::DgraphClient,
    request_id: String,
    body: String,
) -> Result<PendingChange, ModifyUniversalCodeError> {
    let _pending_change = validate(&client, &request_id, &body).await?;

    let _res = update_pending_change(
        &client,
        request_id.clone(),
        PendingChangePatch {
            body: Some(body),
            ..Default::default()
        },
    )
    .await;

    let service_context = ServiceContext::with_user(sp.clone(), user_id)?;

    audit_log_entry(
        &service_context,
        LogType::UniversalCodeChangeRejected,
        Some(request_id.clone()),
        Utc::now().naive_utc(),
    )?;

    let updated_change = pending_change(&client, request_id).await.map_err(|e| {
        ModifyUniversalCodeError::InternalError(format!(
            "Failed to get pending change by request id: {}",
            e.message()
        ))
    })?;

    let updated_change = match updated_change {
        Some(updated_change) => updated_change,
        None => {
            return Err(ModifyUniversalCodeError::InternalError(
                "Unable to find pending change".to_string(),
            ))
        }
    };

    Ok(updated_change)
}

pub async fn validate(
    client: &dgraph::DgraphClient,
    request_id: &str,
    body: &str,
) -> Result<PendingChange, ModifyUniversalCodeError> {
    if body.is_empty() {
        return Err(ModifyUniversalCodeError::InternalError(
            "Body is required".to_string(),
        ));
    }

    let pending_change = match check_pending_change_exists(&client, &request_id).await? {
        Some(pending_change) => pending_change,
        None => return Err(ModifyUniversalCodeError::PendingChangeDoesNotExist),
    };

    if pending_change.status.clone() != ChangeStatus::Pending {
        return Err(ModifyUniversalCodeError::InternalError(
            "Not in Pending status".to_string(),
        ));
    }

    Ok(pending_change)
}

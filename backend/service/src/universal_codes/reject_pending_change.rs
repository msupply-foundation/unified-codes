use std::sync::Arc;

use crate::{
    audit_log::audit_log_entry,
    service_provider::{ServiceContext, ServiceProvider},
};
use chrono::Utc;
use dgraph::{update_pending_change, ChangeStatus, PendingChange, PendingChangePatch};
use repository::LogType;

use super::{validate::check_pending_change_exists, ModifyUniversalCodeError};

pub async fn reject_pending_change(
    sp: Arc<ServiceProvider>,
    user_id: String,
    client: dgraph::DgraphClient,
    request_id: String,
) -> Result<String, ModifyUniversalCodeError> {
    let _pending_change = validate(&client, &request_id).await?;

    let _res = update_pending_change(
        &client,
        request_id.clone(),
        PendingChangePatch {
            status: Some(ChangeStatus::Rejected),
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

    Ok(request_id)
}

pub async fn validate(
    client: &dgraph::DgraphClient,
    request_id: &str,
) -> Result<PendingChange, ModifyUniversalCodeError> {
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

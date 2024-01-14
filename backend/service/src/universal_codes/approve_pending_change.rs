use std::sync::Arc;

use crate::{
    audit_log::audit_log_entry,
    service_provider::{ServiceContext, ServiceProvider},
};
use chrono::Utc;
use dgraph::{Entity, PendingChange};
use repository::LogType;

use super::{
    upsert::{upsert_entity, UpsertUniversalCode},
    validate::check_pending_change_exists,
    ModifyUniversalCodeError,
};

pub async fn approve_pending_change(
    sp: Arc<ServiceProvider>,
    user_id: String,
    client: dgraph::DgraphClient,
    request_id: String,
    updated_entity: UpsertUniversalCode,
) -> Result<Entity, ModifyUniversalCodeError> {
    let _pending_change = validate(&client, &request_id).await?;

    let updated_entity = upsert_entity(sp.clone(), user_id.clone(), client, updated_entity).await;

    // TODO: modify pending_change - flag as complete or remove...

    let service_context = ServiceContext::with_user(sp.clone(), user_id)?;

    audit_log_entry(
        &service_context,
        LogType::UniversalCodeChangeApproved,
        Some(request_id),
        Utc::now().naive_utc(),
    )?;

    updated_entity
}

pub async fn validate(
    client: &dgraph::DgraphClient,
    request_id: &str,
) -> Result<PendingChange, ModifyUniversalCodeError> {
    let pending_change = match check_pending_change_exists(&client, &request_id).await? {
        Some(pending_change) => pending_change,
        None => return Err(ModifyUniversalCodeError::PendingChangeDoesNotExist),
    };

    Ok(pending_change)
}

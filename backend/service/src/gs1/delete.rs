use std::sync::Arc;

use crate::{
    audit_log::audit_log_entry,
    service_provider::{ServiceContext, ServiceProvider},
};
use chrono::Utc;
use dgraph::{delete_gs1::delete_gs1 as dgraph_delete_gs1, gs1::gs1::gs1_by_gtin};
use repository::LogType;

use super::ModifyGS1Error;

pub async fn delete_gs1(
    sp: Arc<ServiceProvider>,
    user_id: String,
    client: dgraph::DgraphClient,
    gtin: String,
) -> Result<u32, ModifyGS1Error> {
    validate(&client, gtin.clone()).await?;

    let result = dgraph_delete_gs1(&client, gtin.clone()).await?;

    // Audit logging
    let service_context = ServiceContext::with_user(sp.clone(), user_id)?;
    audit_log_entry(
        &service_context,
        LogType::GS1Deleted,
        Some(gtin),
        Utc::now().naive_utc(),
    )?;

    Ok(result.numUids)
}

async fn validate(client: &dgraph::DgraphClient, gtin: String) -> Result<(), ModifyGS1Error> {
    // Check that the gtin does exist
    let result = gs1_by_gtin(client, gtin.clone()).await.map_err(|e| {
        ModifyGS1Error::InternalError(format!("Failed to get gs1 by gtin: {}", e.message()))
    })?;

    match result {
        Some(_) => {}
        None => {
            return Err(ModifyGS1Error::GS1DoesNotExist);
        }
    }

    Ok(())
}

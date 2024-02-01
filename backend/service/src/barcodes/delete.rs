use std::sync::Arc;

use crate::{
    audit_log::audit_log_entry,
    service_provider::{ServiceContext, ServiceProvider},
};
use chrono::Utc;
use dgraph::{
    barcode::barcode::barcode_by_gtin, delete_barcode::delete_barcode as dgraph_delete_barcode,
};
use repository::LogType;

use super::ModifyBarcodeError;

pub async fn delete_barcode(
    sp: Arc<ServiceProvider>,
    user_id: String,
    client: dgraph::DgraphClient,
    gtin: String,
) -> Result<u32, ModifyBarcodeError> {
    validate(&client, gtin.clone()).await?;

    let result = dgraph_delete_barcode(&client, gtin.clone()).await?;

    // Audit logging
    let service_context = ServiceContext::with_user(sp.clone(), user_id)?;
    audit_log_entry(
        &service_context,
        LogType::BarcodeDeleted,
        Some(gtin),
        Utc::now().naive_utc(),
    )?;

    Ok(result.numUids)
}

async fn validate(client: &dgraph::DgraphClient, gtin: String) -> Result<(), ModifyBarcodeError> {
    // Check that the barcode does exist
    let result = barcode_by_gtin(client, gtin.clone()).await.map_err(|e| {
        ModifyBarcodeError::InternalError(format!("Failed to get barcode by gtin: {}", e.message()))
    })?;

    match result {
        Some(_) => {}
        None => {
            return Err(ModifyBarcodeError::BarcodeDoesNotExist);
        }
    }

    Ok(())
}

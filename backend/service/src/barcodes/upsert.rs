use std::sync::Arc;

use crate::{
    audit_log::audit_log_entry,
    service_provider::{ServiceContext, ServiceProvider},
};
use chrono::Utc;
use dgraph::{
    barcode::barcode::barcode_by_gtin,
    entity,
    insert_barcode::{insert_barcode, BarcodeInput, EntityCode},
    Barcode,
};
use repository::LogType;

use super::ModifyBarcodeError;

#[derive(Clone, Debug)]
pub struct AddBarcode {
    pub gtin: String,
    pub manufacturer: String,
    pub entity_code: String,
}

pub async fn add_barcode(
    sp: Arc<ServiceProvider>,
    user_id: String,
    client: dgraph::DgraphClient,
    new_barcode: AddBarcode,
) -> Result<Barcode, ModifyBarcodeError> {
    // Validate
    validate(&client, &new_barcode).await?;

    // Generate
    let barcode_input = generate(new_barcode);

    let _result = insert_barcode(&client, barcode_input.clone(), true).await?;

    // Audit logging
    let service_context = ServiceContext::with_user(sp.clone(), user_id)?;
    audit_log_entry(
        &service_context,
        LogType::BarcodeCreated,
        Some(barcode_input.gtin.clone()),
        Utc::now().naive_utc(),
    )?;

    // Query to get the newly created barcode
    let result = barcode_by_gtin(&client, barcode_input.gtin)
        .await
        .map_err(|e| {
            ModifyBarcodeError::InternalError(format!(
                "Failed to get newly created barcode by gtin: {}",
                e.message()
            ))
        })?;

    let result = match result {
        Some(result) => result,
        None => {
            return Err(ModifyBarcodeError::InternalError(
                "Unable to find newly created barcode".to_string(),
            ))
        }
    };

    Ok(result)
}

pub fn generate(new_barcode: AddBarcode) -> BarcodeInput {
    BarcodeInput {
        gtin: new_barcode.gtin.clone(),
        manufacturer: new_barcode.manufacturer.clone(),
        entity: EntityCode {
            code: new_barcode.entity_code.clone(),
        },
    }
}

pub async fn validate(
    _client: &dgraph::DgraphClient,
    new_barcode: &AddBarcode,
) -> Result<(), ModifyBarcodeError> {
    if new_barcode.gtin.is_empty() {
        return Err(ModifyBarcodeError::InternalError(
            "GTIN is required".to_string(),
        ));
    }

    if new_barcode.manufacturer.is_empty() {
        return Err(ModifyBarcodeError::InternalError(
            "Manufacturer is required".to_string(),
        ));
    }

    if new_barcode.entity_code.is_empty() {
        return Err(ModifyBarcodeError::InternalError(
            "Entity code is required".to_string(),
        ));
    }

    let existing = barcode_by_gtin(_client, new_barcode.gtin.clone()).await?;

    match existing {
        Some(_) => return Err(ModifyBarcodeError::BarcodeAlreadyExists),
        None => {}
    }

    let entity = entity::entity_by_code(_client, new_barcode.entity_code.clone()).await?;

    match entity {
        Some(_) => {}
        None => return Err(ModifyBarcodeError::UniversalCodeDoesNotExist),
    }

    Ok(())
}

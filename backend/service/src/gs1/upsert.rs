use std::sync::Arc;

use crate::{
    audit_log::audit_log_entry,
    service_provider::{ServiceContext, ServiceProvider},
};
use chrono::Utc;
use dgraph::{
    entity,
    gs1::gs1::gs1_by_gtin,
    insert_gs1::{insert_gs1, EntityCode, GS1Input},
    GS1,
};
use repository::LogType;

use super::ModifyGS1Error;

#[derive(Clone, Debug)]
pub struct AddGS1 {
    pub gtin: String,
    pub manufacturer: String,
    pub entity_code: String,
}

pub async fn add_gs1(
    sp: Arc<ServiceProvider>,
    user_id: String,
    client: dgraph::DgraphClient,
    new_gs1: AddGS1,
) -> Result<GS1, ModifyGS1Error> {
    // Validate
    validate(&client, &new_gs1).await?;

    // Generate
    let gs1_input = generate(new_gs1);

    let _result = insert_gs1(&client, gs1_input.clone(), true).await?;

    // Audit logging
    let service_context = ServiceContext::with_user(sp.clone(), user_id)?;
    audit_log_entry(
        &service_context,
        LogType::GS1Created,
        Some(gs1_input.gtin.clone()),
        Utc::now().naive_utc(),
    )?;

    // Query to get the newly created gs1
    let result = gs1_by_gtin(&client, gs1_input.gtin).await.map_err(|e| {
        ModifyGS1Error::InternalError(format!(
            "Failed to get newly created gs1 by gtin: {}",
            e.message()
        ))
    })?;

    let result = match result {
        Some(result) => result,
        None => {
            return Err(ModifyGS1Error::InternalError(
                "Unable to find newly created gs1".to_string(),
            ))
        }
    };

    Ok(result)
}

pub fn generate(new_gs1: AddGS1) -> GS1Input {
    GS1Input {
        gtin: new_gs1.gtin.clone(),
        manufacturer: new_gs1.manufacturer.clone(),
        entity: EntityCode {
            code: new_gs1.entity_code.clone(),
        },
    }
}

pub async fn validate(
    _client: &dgraph::DgraphClient,
    new_gs1: &AddGS1,
) -> Result<(), ModifyGS1Error> {
    if new_gs1.gtin.is_empty() {
        return Err(ModifyGS1Error::InternalError(
            "GTIN is required".to_string(),
        ));
    }

    if new_gs1.manufacturer.is_empty() {
        return Err(ModifyGS1Error::InternalError(
            "Manufacturer is required".to_string(),
        ));
    }

    if new_gs1.entity_code.is_empty() {
        return Err(ModifyGS1Error::InternalError(
            "Entity code is required".to_string(),
        ));
    }

    let existing = gs1_by_gtin(_client, new_gs1.gtin.clone()).await?;

    match existing {
        Some(_) => return Err(ModifyGS1Error::GS1AlreadyExists),
        None => {}
    }

    let entity = entity::entity_by_code(_client, new_gs1.entity_code.clone()).await?;

    match entity {
        Some(_) => {}
        None => return Err(ModifyGS1Error::UniversalCodeDoesNotExist),
    }

    Ok(())
}

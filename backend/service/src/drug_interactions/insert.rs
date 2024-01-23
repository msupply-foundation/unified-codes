use std::sync::Arc;

use super::ModifyDrugInteractionError;
use crate::{
    audit_log::audit_log_entry,
    service_provider::{ServiceContext, ServiceProvider},
};
use chrono::Utc;
use dgraph::insert_interaction_group::{insert_interaction_group, DrugCode, InteractionGroupInput};
use repository::LogType;

#[derive(Clone, Debug)]
pub struct AddInteractionGroup {
    pub interaction_group_id: String,
    pub name: String,
    pub description: Option<String>,
    pub drugs: Vec<String>,
}

pub async fn add_drug_interaction_group(
    sp: Arc<ServiceProvider>,
    user_id: String,
    client: dgraph::DgraphClient,
    new_interaction_group: AddInteractionGroup,
) -> Result<u32, ModifyDrugInteractionError> {
    // Validate
    validate(&client, &new_interaction_group).await?;

    // Generate
    let item_input = generate(new_interaction_group.clone())?;

    let result = insert_interaction_group(&client, item_input.clone(), true).await?;

    // Audit logging
    let service_context = ServiceContext::with_user(sp.clone(), user_id)?;
    audit_log_entry(
        &service_context,
        LogType::InteractionGroupCreated,
        Some(item_input.interaction_group_id),
        Utc::now().naive_utc(),
    )?;

    Ok(result.numUids)
}

pub fn generate(
    new_item: AddInteractionGroup,
) -> Result<InteractionGroupInput, ModifyDrugInteractionError> {
    Ok(InteractionGroupInput {
        interaction_group_id: new_item.interaction_group_id,
        name: new_item.name,
        description: new_item.description,
        drugs: new_item
            .drugs
            .iter()
            .map(|drug_code| DrugCode {
                code: drug_code.to_string(),
            })
            .collect(),
    })
}

pub async fn validate(
    _client: &dgraph::DgraphClient,
    new_item: &AddInteractionGroup,
) -> Result<(), ModifyDrugInteractionError> {
    if new_item.name.is_empty() {
        return Err(ModifyDrugInteractionError::InternalError(
            "Name is required".to_string(),
        ));
    }

    // TODO: Check if the name already exists
    Ok(())
}

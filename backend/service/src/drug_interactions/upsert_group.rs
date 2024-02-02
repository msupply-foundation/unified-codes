use std::sync::Arc;

use super::ModifyDrugInteractionError;
use crate::{
    audit_log::audit_log_entry,
    service_provider::{ServiceContext, ServiceProvider},
};
use chrono::Utc;
use dgraph::{
    insert_interaction_group::{insert_interaction_group, InteractionGroupInput},
    interaction_group::interaction_group_by_id,
    interaction_groups::{interaction_groups, InteractionGroupFilter},
    update_interaction_group::{update_interaction_group, InteractionGroupUpdateInput},
    DrugCode, InteractionGroup,
};
use repository::LogType;

#[derive(Clone, Debug)]
pub struct UpsertDrugInteractionGroup {
    pub interaction_group_id: String,
    pub name: String,
    pub description: Option<String>,
    pub drugs: Vec<String>,
}

pub async fn upsert_drug_interaction_group(
    sp: Arc<ServiceProvider>,
    user_id: String,
    client: dgraph::DgraphClient,
    new_interaction_group: UpsertDrugInteractionGroup,
) -> Result<u32, ModifyDrugInteractionError> {
    // Validate
    let old_record = validate(&client, &new_interaction_group).await?;

    // Generate
    let (item_input, drugs_to_remove) = generate(new_interaction_group.clone(), old_record)?;

    // If we have drugs to remove, we need to update the existing record
    let result = match drugs_to_remove.is_empty() {
        true => insert_interaction_group(&client, item_input.clone(), true).await?,
        false => {
            let update_input = InteractionGroupUpdateInput {
                interaction_group_id: item_input.interaction_group_id.clone(),
                name: item_input.name.clone(),
                description: item_input.description.clone(),
                drugs_add: item_input.drugs.clone(),
                drugs_remove: drugs_to_remove,
            };
            update_interaction_group(&client, update_input).await?
        }
    };

    // Audit logging
    let service_context = ServiceContext::with_user(sp.clone(), user_id)?;
    audit_log_entry(
        &service_context,
        LogType::InteractionGroupUpserted,
        Some(item_input.interaction_group_id),
        Utc::now().naive_utc(),
    )?;

    Ok(result.numUids)
}

pub fn generate(
    new_item: UpsertDrugInteractionGroup,
    old_record: Option<InteractionGroup>,
) -> Result<(InteractionGroupInput, Vec<DrugCode>), ModifyDrugInteractionError> {
    // Check if we need to remove any drugs from the old record
    let mut drugs_remove: Vec<String> = Vec::new();
    if let Some(old_record) = old_record {
        for drug in old_record.drugs {
            if !new_item.drugs.contains(&drug.code) {
                drugs_remove.push(drug.code);
            }
        }
    }

    Ok((
        InteractionGroupInput {
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
        },
        drugs_remove
            .iter()
            .map(|drug_code| DrugCode {
                code: drug_code.to_string(),
            })
            .collect(),
    ))
}

pub async fn validate(
    client: &dgraph::DgraphClient,
    new_item: &UpsertDrugInteractionGroup,
) -> Result<Option<InteractionGroup>, ModifyDrugInteractionError> {
    if new_item.name.is_empty() {
        return Err(ModifyDrugInteractionError::InternalError(
            "Name is required".to_string(),
        ));
    }

    // look up existing record
    let old_record = interaction_group_by_id(client, new_item.interaction_group_id.clone()).await?;

    let groups_with_same_name = interaction_groups(
        client,
        Some(InteractionGroupFilter {
            name: Some(new_item.name.clone()),
        }),
    )
    .await?;

    match groups_with_same_name {
        Some(groups_with_same_name) => {
            if groups_with_same_name.data.len() > 0
                && groups_with_same_name.data[0].interaction_group_id
                    != new_item.interaction_group_id
            {
                return Err(ModifyDrugInteractionError::InternalError(
                    "Interaction group with same name already exists".to_string(),
                ));
            }
        }
        None => {}
    }

    Ok(old_record)
}

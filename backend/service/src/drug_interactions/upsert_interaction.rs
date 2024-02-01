use std::sync::Arc;

use super::ModifyDrugInteractionError;
use crate::{
    audit_log::audit_log_entry,
    service_provider::{ServiceContext, ServiceProvider},
};
use chrono::Utc;
use dgraph::{
    insert_interaction::{insert_drug_interaction, DrugInteractionInput},
    interaction::interaction_by_id,
    interactions::{interactions, DrugInteractionFilter},
    update_interaction::{update_interaction, DrugInteractionUpdateInput},
    DrugCode, DrugInteraction, DrugInteractionSeverity, InteractionGroupRef,
};
use repository::LogType;

#[derive(Clone, Debug)]
pub struct UpsertDrugInteraction {
    pub interaction_id: String,
    pub name: String,
    pub severity: DrugInteractionSeverity,
    pub description: String,
    pub action: String,
    pub reference: String,
    pub drug_code_1: Option<String>,
    pub drug_code_2: Option<String>,
    pub interaction_group_id_1: Option<String>,
    pub interaction_group_id_2: Option<String>,
}

pub async fn upsert_drug_interaction(
    sp: Arc<ServiceProvider>,
    user_id: String,
    client: dgraph::DgraphClient,
    new_interaction: UpsertDrugInteraction,
) -> Result<u32, ModifyDrugInteractionError> {
    // Validate
    let old_record = validate(&client, &new_interaction).await?;

    // Generate
    let (item_input, drugs_to_remove, groups_to_remove) =
        generate(new_interaction.clone(), old_record)?;

    // If we have drugs or groups to remove, we need to update the existing record
    let result = match drugs_to_remove.is_empty() || groups_to_remove.is_empty() {
        true => insert_drug_interaction(&client, item_input.clone(), true).await?,
        false => {
            let update_input = DrugInteractionUpdateInput {
                interaction_id: item_input.interaction_id.clone(),
                name: item_input.name.clone(),
                description: item_input.description.clone(),
                severity: item_input.severity.clone(),
                action: item_input.action.clone(),
                reference: item_input.reference.clone(),
                drugs_add: item_input.drugs.clone(),
                drugs_remove: drugs_to_remove,
                groups_add: item_input.groups.clone(),
                groups_remove: groups_to_remove,
            };
            update_interaction(&client, update_input).await?
        }
    };

    // Audit logging
    let service_context = ServiceContext::with_user(sp.clone(), user_id)?;
    audit_log_entry(
        &service_context,
        LogType::InteractionUpserted,
        Some(item_input.interaction_id),
        Utc::now().naive_utc(),
    )?;

    Ok(result.numUids)
}

pub fn generate(
    new_item: UpsertDrugInteraction,
    old_record: Option<DrugInteraction>,
) -> Result<
    (
        DrugInteractionInput,
        Vec<DrugCode>,
        Vec<InteractionGroupRef>,
    ),
    ModifyDrugInteractionError,
> {
    // Check if we need to remove any drugs from the old record
    let mut drugs_remove: Vec<String> = Vec::new();
    if let Some(old_record) = old_record.clone() {
        for drug in old_record.drugs {
            if new_item.drug_code_1 != Some(drug.code.clone())
                && new_item.drug_code_2 != Some(drug.code.clone())
            {
                drugs_remove.push(drug.code);
            }
        }
    }

    // Check if we need to remove any groups from the old record
    let mut groups_remove: Vec<String> = Vec::new();
    if let Some(old_record) = old_record {
        for group in old_record.groups {
            if new_item.interaction_group_id_1 != Some(group.interaction_group_id.clone())
                && new_item.interaction_group_id_2 != Some(group.interaction_group_id.clone())
            {
                groups_remove.push(group.interaction_group_id);
            }
        }
    }

    let mut drugs = Vec::new();
    if let Some(drug_code) = new_item.drug_code_1 {
        drugs.push(DrugCode {
            code: drug_code.to_string(),
        });
    }
    if let Some(drug_code) = new_item.drug_code_2 {
        drugs.push(DrugCode {
            code: drug_code.to_string(),
        });
    }

    let mut groups = Vec::new();
    if let Some(interaction_group_id) = new_item.interaction_group_id_1 {
        groups.push(InteractionGroupRef {
            interaction_group_id: interaction_group_id.to_string(),
        });
    }
    if let Some(interaction_group_id) = new_item.interaction_group_id_2 {
        groups.push(InteractionGroupRef {
            interaction_group_id: interaction_group_id.to_string(),
        });
    }

    Ok((
        DrugInteractionInput {
            interaction_id: new_item.interaction_id,
            name: new_item.name,
            severity: new_item.severity,
            description: new_item.description,
            action: new_item.action,
            reference: new_item.reference,
            drugs: drugs,
            groups: groups,
        },
        drugs_remove
            .iter()
            .map(|drug_code| DrugCode {
                code: drug_code.to_string(),
            })
            .collect(),
        groups_remove
            .iter()
            .map(|group_id| InteractionGroupRef {
                interaction_group_id: group_id.to_string(),
            })
            .collect(),
    ))
}

pub async fn validate(
    client: &dgraph::DgraphClient,
    new_item: &UpsertDrugInteraction,
) -> Result<Option<DrugInteraction>, ModifyDrugInteractionError> {
    if new_item.name.is_empty() {
        return Err(ModifyDrugInteractionError::InternalError(
            "Name is required".to_string(),
        ));
    }

    // look up existing record
    let old_record = interaction_by_id(client, new_item.interaction_id.clone()).await?;

    let groups_with_same_name = interactions(
        client,
        Some(DrugInteractionFilter {
            name: Some(new_item.name.clone()),
        }),
    )
    .await?;

    match groups_with_same_name {
        Some(groups_with_same_name) => {
            if groups_with_same_name.data.len() > 0
                && groups_with_same_name.data[0].interaction_id != new_item.interaction_id
            {
                return Err(ModifyDrugInteractionError::InternalError(
                    "Interaction with same name already exists".to_string(),
                ));
            }
        }
        None => {}
    }

    // Check that we have only 2 interacting items specified
    if new_item.drug_code_1.is_some() && new_item.interaction_group_id_1.is_some() {
        return Err(ModifyDrugInteractionError::InternalError(
            "Please specify only 1 drug or interaction_group in the first slot".to_string(),
        ));
    }

    if new_item.drug_code_2.is_some() && new_item.interaction_group_id_2.is_some() {
        return Err(ModifyDrugInteractionError::InternalError(
            "Please specify only 1 drug or interaction_group in the second slot".to_string(),
        ));
    }

    // Check that we have both interacting items specified
    if new_item.drug_code_1.is_none() && new_item.interaction_group_id_1.is_none() {
        return Err(ModifyDrugInteractionError::InternalError(
            "Please specify a drug or interaction_group in the first slot".to_string(),
        ));
    }
    if new_item.drug_code_2.is_none() && new_item.interaction_group_id_2.is_none() {
        return Err(ModifyDrugInteractionError::InternalError(
            "Please specify a drug or interaction_group in the second slot".to_string(),
        ));
    }

    Ok(old_record)
}

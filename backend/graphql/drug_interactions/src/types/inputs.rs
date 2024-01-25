use async_graphql::*;
use service::drug_interactions::upsert::UpsertDrugInteractionGroup;

#[derive(InputObject, Clone)]
pub struct AddDrugInteractionGroupInput {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub drugs: Vec<String>,
}

impl From<AddDrugInteractionGroupInput> for UpsertDrugInteractionGroup {
    fn from(input: AddDrugInteractionGroupInput) -> Self {
        UpsertDrugInteractionGroup {
            interaction_group_id: input.id,
            name: input.name,
            description: input.description,
            drugs: input.drugs,
        }
    }
}

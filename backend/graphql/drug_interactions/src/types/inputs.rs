use async_graphql::*;
use service::drug_interactions::upsert::UpsertDrugInteractionGroup;

#[derive(InputObject, Clone)]
pub struct UpsertDrugInteractionGroupInput {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub drugs: Vec<String>,
}

impl From<UpsertDrugInteractionGroupInput> for UpsertDrugInteractionGroup {
    fn from(input: UpsertDrugInteractionGroupInput) -> Self {
        UpsertDrugInteractionGroup {
            interaction_group_id: input.id,
            name: input.name,
            description: input.description,
            drugs: input.drugs,
        }
    }
}

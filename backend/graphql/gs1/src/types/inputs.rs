use async_graphql::*;
use service::gs1::upsert::AddGS1;

#[derive(InputObject, Clone)]
pub struct AddGS1Input {
    pub gtin: String,
    pub manufacturer: String,
    pub entity_code: String,
}

impl From<AddGS1Input> for AddGS1 {
    fn from(input: AddGS1Input) -> Self {
        AddGS1 {
            gtin: input.gtin,
            manufacturer: input.manufacturer,
            entity_code: input.entity_code,
        }
    }
}

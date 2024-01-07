use async_graphql::*;
use graphql_universal_codes_v1::EntityType;
use service::universal_codes::upsert::UpsertUniversalCode;

#[derive(InputObject, Clone)]
pub struct UpsertEntityInput {
    pub code: String,
    pub name: Option<String>,
    pub description: Option<String>,
    pub r#type: Option<String>,
    pub category: Option<String>,
}

impl From<UpsertEntityInput> for UpsertUniversalCode {
    fn from(
        UpsertEntityInput {
            code,
            name,
            description,
            r#type,
            category,
        }: UpsertEntityInput,
    ) -> Self {
        UpsertUniversalCode {
            code,
            name,
            description,
            r#type,
            category,
        }
    }
}

#[derive(Union)]
pub enum UpsertEntityResponse {
    Response(EntityType),
}

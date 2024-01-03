use async_graphql::*;
use graphql_universal_codes_v1::EntityType;
use service::universal_codes::{properties::PropertyReference, upsert::UpsertUniversalCode};

#[derive(InputObject, Clone)]
pub struct UpsertEntityInput {
    pub code: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub r#type: Option<String>,
    pub category: Option<String>,
    pub properties: Option<Vec<PropertyInput>>,
    pub children: Option<Vec<UpsertEntityInput>>,
}

#[derive(InputObject, Clone)]
pub struct PropertyInput {
    pub key: String,
    pub value: String,
}

impl From<UpsertEntityInput> for UpsertUniversalCode {
    fn from(
        UpsertEntityInput {
            code,
            name,
            description,
            r#type,
            category,
            properties,
            children,
        }: UpsertEntityInput,
    ) -> Self {
        UpsertUniversalCode {
            code,
            name,
            description,
            r#type,
            category,
            properties: properties.map(|properties| {
                properties
                    .into_iter()
                    .map(|PropertyInput { key, value }| PropertyReference { key, value })
                    .collect()
            }),
            children: children.map(|children| {
                children
                    .into_iter()
                    .map(|child| UpsertUniversalCode::from(child))
                    .collect()
            }),
        }
    }
}

#[derive(Union)]
pub enum UpsertEntityResponse {
    Response(EntityType),
}

use async_graphql::*;
use dgraph::{ChangeStatus, DgraphOrderByType};
use graphql_types::types::{ChangeTypeNode, PendingChangeNode};
use graphql_universal_codes_v1::EntityType;
use service::universal_codes::{
    properties::PropertyReference, upsert::UpsertUniversalCode,
    upsert_pending_change::UpsertPendingChange,
};

#[derive(Enum, Copy, Clone, PartialEq, Eq)]
#[graphql(rename_items = "camelCase")]
pub enum PendingChangeSortFieldInput {
    Name,
    Category,
    DateRequested,
}

#[derive(InputObject)]
pub struct PendingChangeSortInput {
    /// Sort query result by `key`
    key: PendingChangeSortFieldInput,
    /// Sort query result is sorted descending or ascending (if not provided the default is
    /// ascending)
    desc: Option<bool>,
}
impl PendingChangeSortInput {
    pub fn to_domain(self) -> DgraphOrderByType {
        let key = match self.key {
            PendingChangeSortFieldInput::Name => "name",
            PendingChangeSortFieldInput::Category => "category",
            PendingChangeSortFieldInput::DateRequested => "date_requested",
        };

        DgraphOrderByType {
            asc: match self.desc {
                Some(true) => None,
                Some(false) => Some(key.to_string()),
                None => Some(key.to_string()),
            },
            desc: match self.desc {
                Some(true) => Some(key.to_string()),
                Some(false) => None,
                None => None,
            },
        }
    }
}

#[derive(InputObject, Clone)]
pub struct UpsertEntityInput {
    pub code: Option<String>,
    pub parent_code: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub r#type: Option<String>,
    pub category: Option<String>,
    pub properties: Option<Vec<PropertyInput>>,
    pub children: Option<Vec<UpsertEntityInput>>,
}

#[derive(InputObject, Clone)]
pub struct PropertyInput {
    pub code: String,
    pub key: String,
    pub value: String,
}

impl From<UpsertEntityInput> for UpsertUniversalCode {
    fn from(
        UpsertEntityInput {
            code,
            parent_code,
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
            parent_code,
            name,
            description,
            r#type,
            category,
            properties: properties.map(|properties| {
                properties
                    .into_iter()
                    .map(|PropertyInput { code, key, value }| PropertyReference {
                        code,
                        key,
                        value,
                    })
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

#[derive(InputObject, Clone)]
pub struct RequestChangeInput {
    pub request_id: String,
    pub name: String,
    pub category: String,
    pub body: String,
    pub change_type: ChangeTypeNode,
    pub requested_for: String,
}

impl From<RequestChangeInput> for UpsertPendingChange {
    fn from(
        RequestChangeInput {
            request_id,
            name,
            category,
            requested_for,
            body,
            change_type,
        }: RequestChangeInput,
    ) -> Self {
        UpsertPendingChange {
            request_id,
            name,
            category,
            body,
            requested_for,
            change_type: ChangeTypeNode::to_domain(change_type),
            status: ChangeStatus::Pending,
        }
    }
}

#[derive(Union)]
pub enum RequestChangeResponse {
    Response(PendingChangeNode),
}

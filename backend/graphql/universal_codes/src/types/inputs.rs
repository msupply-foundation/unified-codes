use async_graphql::*;
use dgraph::DgraphOrderByType;
use graphql_types::types::{ChangeTypeNode, PendingChangeNode};
use graphql_universal_codes_v1::EntityType;
use service::universal_codes::{
    add_pending_change::AddPendingChange, properties::PropertyReference,
    upsert::UpsertUniversalCode,
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
    pub alternative_names: Option<Vec<AlternativeNameInput>>,
    pub properties: Option<Vec<PropertyInput>>,
    pub children: Option<Vec<UpsertEntityInput>>,
}

#[derive(InputObject, Clone)]
pub struct PropertyInput {
    pub code: String,
    pub key: String,
    pub value: String,
}

#[derive(InputObject, Clone)]
pub struct AlternativeNameInput {
    pub code: String,
    pub name: String,
}

impl AlternativeNameInput {
    pub fn to_domain(names: Option<Vec<AlternativeNameInput>>) -> Option<String> {
        match names {
            Some(names) => {
                if names.len() > 0 {
                    Some(
                        names
                            .into_iter()
                            .map(|alt_name| alt_name.name)
                            .collect::<Vec<String>>()
                            .join(","),
                    )
                } else {
                    None
                }
            }
            None => None,
        }
    }
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
            alternative_names,
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
            alternative_names: AlternativeNameInput::to_domain(alternative_names),
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
}

impl From<RequestChangeInput> for AddPendingChange {
    fn from(
        RequestChangeInput {
            request_id,
            name,
            category,
            body,
            change_type,
        }: RequestChangeInput,
    ) -> Self {
        AddPendingChange {
            request_id,
            name,
            category,
            body,
            change_type: ChangeTypeNode::to_domain(change_type),
        }
    }
}

#[derive(Union)]
pub enum RequestChangeResponse {
    Response(PendingChangeNode),
}

#[cfg(test)]
mod test {
    use super::AlternativeNameInput;

    #[test]
    fn alt_name_input_to_domain_maps_names() {
        let alt_names = vec![
            AlternativeNameInput {
                code: "test_1_code".to_string(),
                name: "test_1".to_string(),
            },
            AlternativeNameInput {
                code: "test_2_code".to_string(),
                name: "test_2".to_string(),
            },
        ];

        let res = AlternativeNameInput::to_domain(Some(alt_names));

        assert!(res.is_some());
        assert_eq!(res.unwrap(), "test_1,test_2".to_string())
    }

    #[test]
    fn alt_name_input_to_domain_empty_arr_to_none() {
        let alt_names = vec![];

        let res = AlternativeNameInput::to_domain(Some(alt_names));

        assert!(res.is_none());
    }

    #[test]
    fn alt_name_input_to_domain_none_to_none() {
        let res = AlternativeNameInput::to_domain(None);

        assert!(res.is_none());
    }
}

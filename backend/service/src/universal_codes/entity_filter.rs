use dgraph::{DgraphFilter, DgraphFilterType, DgraphOrderByType};

#[derive(Debug, Clone)]
pub struct EntitySearchFilter {
    pub code: Option<String>,
    pub description: Option<String>,
    pub order_by: Option<EntitySort>,
    pub categories: Option<Vec<String>>,
    pub r#type: Option<String>,
    pub search: Option<String>,
    pub r#match: Option<String>,
}

#[derive(Debug, Clone)]
pub struct EntitySort {
    pub descending: Option<bool>,
    pub field: String,
}

pub fn dgraph_filter_from_v1_filter(filter: EntitySearchFilter) -> DgraphFilter {
    // TODO: Better Search!

    // mSupply has a `special` way of querying that v1 API uses.
    // and we need to set the type to ["Unit", "DoseStrength", "Presentation", "ExtraDescription"] (in clause, where as normally this is a single string)
    let is_msupply = filter
        .r#type
        .clone()
        .unwrap_or_default()
        .contains("medicinal_product");

    // Upper case the first letter of each known category (Drug, Consumable, Other)
    // This is because the v1 API uses lowercase, but dGraph uses uppercase
    let filter_categories: Option<Vec<String>> = match filter.categories.clone() {
        Some(categories) => {
            let categories = categories
                .iter()
                .map(|category| match category.as_str() {
                    "drug" => "Drug".to_string(),
                    "consumable" => "Consumable".to_string(),
                    "vaccine" => "Vaccine".to_string(),
                    "other" => "Other".to_string(),
                    _ => category.to_string(),
                })
                .collect();

            Some(categories)
        }
        None => None,
    };

    // Map the incoming `type` field to the one we use in dGraph
    let filter_type: Option<DgraphFilterType> = match filter.r#type.clone() {
        Some(r#type) => match is_msupply {
            true => Some(DgraphFilterType {
                r#in: Some(vec![
                    // for vaccines and drugs
                    "Unit".to_string(),
                    "DoseStrength".to_string(),
                    // for consumables
                    "Presentation".to_string(),
                    "ExtraDescription".to_string(),
                ]),
                ..Default::default()
            }),
            false => {
                let t = match r#type.as_str() {
                    "drug" => "Product".to_string(),
                    "consumable" => "Product".to_string(),
                    "vaccine" => "Product".to_string(),
                    "other" => "Product".to_string(), // These first four are represented by the same type in dGraph, we map back on queries
                    "Drug" => "Product".to_string(),
                    "Consumable" => "Product".to_string(),
                    "Vaccine" => "Product".to_string(),
                    "Other" => "Product".to_string(), // Uppercase versions of the above
                    // the v1 API supports these lowercase variations of the type filter
                    "form_category" => "Route".to_string(),
                    "form" => "Form".to_string(),
                    "form_qualifier" => "FormQualifier".to_string(),
                    "strength" => "DoseStrength".to_string(),
                    "unit_of_use" => "Unit".to_string(),
                    "PackImmediate" => "PackImmediate".to_string(),
                    _ => r#type,
                };
                Some(DgraphFilterType {
                    eq: Some(t),
                    ..Default::default()
                })
            }
        },
        None => None,
    };

    let description_regexp = match filter.description.clone() {
        Some(description) => match filter.r#match.clone() {
            Some(r#match) => match r#match.as_str() {
                "exact" => Some(format!("/^{}$/i", description)),
                "contains" => Some(format!("/.*{}.*/i", description)),
                "begin" => Some(format!("/^{}.*$/i", description)),
                _ => Some(format!("^/{}.*/i", description)),
            },
            None => Some(format!("/^{}.*$/i", description)),
        },
        None => match filter.search.clone() {
            Some(search) => Some(format!("/.*{}.*/i", search)),
            None => None,
        },
    };

    let base_filter = DgraphFilter {
        code: filter.code.map(|code| {
            // Empty string should be considered missing
            if code == "" {
                return DgraphFilterType {
                    ..Default::default()
                };
            }
            DgraphFilterType {
                eq: Some(code),
                ..Default::default()
            }
        }),
        category: filter_categories.map(|categories| DgraphFilterType {
            r#in: Some(categories),
            ..Default::default()
        }),
        r#type: filter_type,
        description: None,
        or: None,
        alternative_names: None,
    };

    DgraphFilter {
        or: filter.search.map(|search_string| {
            vec![
                DgraphFilter {
                    description: Some(DgraphFilterType {
                        regexp: Some(format!("/.*{}.*/i", search_string)),
                        ..Default::default()
                    }),
                    ..base_filter.clone()
                },
                DgraphFilter {
                    alternative_names: Some(DgraphFilterType {
                        regexp: Some(format!("/.*{}.*/i", search_string)),
                        ..Default::default()
                    }),
                    ..base_filter.clone()
                },
                DgraphFilter {
                    code: Some(DgraphFilterType {
                        regexp: Some(format!("/^{}.*$/i", search_string)), // begins with
                        ..Default::default()
                    }),
                    ..base_filter.clone()
                },
            ]
        }),
        description: description_regexp.map(|desc| DgraphFilterType {
            regexp: Some(desc),
            ..Default::default()
        }),
        ..base_filter
    }
}

pub fn dgraph_order_by_from_v1_filter(filter: EntitySearchFilter) -> Option<DgraphOrderByType> {
    match filter.order_by {
        Some(order_by) => {
            let field = match order_by.field.as_str() {
                "code" => "code".to_string(),
                "Code" => "code".to_string(),
                "name" => "name".to_string(),
                "Name" => "name".to_string(),
                "description" => "description".to_string(),
                "Description" => "description".to_string(),
                "category" => "category".to_string(),
                "Category" => "category".to_string(),
                "type" => "type".to_string(),
                "Type" => "type".to_string(),
                _ => "code".to_string(),
            };

            match order_by.descending {
                Some(true) => Some(DgraphOrderByType {
                    desc: Some(field),
                    ..Default::default()
                }),
                Some(false) => Some(DgraphOrderByType {
                    asc: Some(field),
                    ..Default::default()
                }),
                None => Some(DgraphOrderByType {
                    asc: Some(field),
                    ..Default::default()
                }),
            }
        }
        None => None,
    }
}

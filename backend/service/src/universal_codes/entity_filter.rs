use dgraph::{DgraphFilter, DgraphFilterType};

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
    // TODO: Handle `match`
    // TODO: Handle `type`
    // TODO: Handle `order_by`

    // TODO: Better Search!

    let description_regexp = match filter.description.clone() {
        Some(description) => match filter.r#match {
            Some(r#match) => match r#match.as_str() {
                "exact" => Some(format!("/^{}$/i", description)),
                "contains" => Some(format!("/.*{}.*/i", description)),
                "begin" => Some(format!("/^{}.*$/i", description)),
                _ => Some(format!("^/{}.*/i", description)),
            },
            None => Some(format!("/^{}.*$/i", description)),
        },
        None => None,
    };

    DgraphFilter {
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
        description: filter.description.map(|_desc| DgraphFilterType {
            regexp: description_regexp,
            ..Default::default()
        }),
    }
}

pub fn dgraph_categories_from_v1_filter(filter: EntitySearchFilter) -> Option<Vec<String>> {
    let filter_categories = match filter.categories {
        Some(categories) => categories,
        None => {
            return None;
        }
    };

    // Upper case the first letter of each valid category (Drug, Consumable, Other)
    let categories = filter_categories
        .iter()
        .map(|category| match category.as_str() {
            "drug" => "Drug".to_string(),
            "consumable" => "Consumable".to_string(),
            "other" => "Other".to_string(),
            _ => category.to_string(),
        })
        .collect();

    Some(categories)
}

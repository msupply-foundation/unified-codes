/*
input EntitySearchInput {
  code: String
  description: String
  orderBy: EntitySortInput
  categories: [String!]
  type: String
  search: String
  match: String
}

*/

use async_graphql::InputObject;
use service::universal_codes::{entity_filter::EntitySort, EntitySearchFilter};

use super::EntitySortInput;

#[derive(InputObject)]
pub struct EntitySearchInput {
    pub code: Option<String>,
    pub description: Option<String>,
    pub order_by: Option<EntitySortInput>,
    pub categories: Option<Vec<String>>,
    pub r#type: Option<String>,
    pub search: Option<String>,
    pub r#match: Option<String>,
}

impl From<EntitySearchInput> for EntitySearchFilter {
    fn from(f: EntitySearchInput) -> Self {
        EntitySearchFilter {
            code: f.code,
            // many descriptions contain slashes, we need to escape them to provide a valid search input
            description: f.description.map(|d| d.replace("/", "\\/")),
            search: f.search.map(|s| s.replace("/", "\\/")),
            order_by: f.order_by.map(|order| EntitySort {
                descending: order.descending,
                field: order.field,
            }),
            categories: f.categories,
            r#type: f.r#type,
            r#match: f.r#match,
        }
    }
}

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

/*
input EntitySortInput {
  descending: Boolean
  field: String
}
*/

#[derive(InputObject)]
pub struct EntitySortInput {
    pub descending: Option<bool>,
    pub field: String,
}

impl From<EntitySearchInput> for EntitySearchFilter {
    fn from(f: EntitySearchInput) -> Self {
        EntitySearchFilter {
            code: f.code,
            description: f.description,
            order_by: f.order_by.map(|order| EntitySort {
                descending: order.descending,
                field: order.field,
            }),
            categories: f.categories,
            r#type: f.r#type,
            search: f.search,
            r#match: f.r#match,
        }
    }
}

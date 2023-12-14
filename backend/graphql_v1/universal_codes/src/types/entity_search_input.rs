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

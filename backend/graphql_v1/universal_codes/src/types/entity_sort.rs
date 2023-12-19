use async_graphql::InputObject;

#[derive(InputObject)]
pub struct EntitySortInput {
    pub descending: Option<bool>,
    pub field: String,
}

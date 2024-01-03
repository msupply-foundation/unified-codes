mod mutations;
use self::mutations::*;
mod types;
use self::types::*;

use async_graphql::*;

#[derive(Default, Clone)]
pub struct UniversalCodesMutations;

#[Object]
impl UniversalCodesMutations {
    async fn upsert_entity(&self, ctx: &Context<'_>, input: UpsertEntityInput) -> Result<u32> {
        upsert_entity(ctx, input).await
    }
}

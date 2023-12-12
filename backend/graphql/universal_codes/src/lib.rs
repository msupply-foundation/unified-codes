mod types;

use self::types::*;

use async_graphql::*;
use datasource::entity_by_code;

#[derive(Default, Clone)]
pub struct UniversalCodesQueries;

#[Object]
impl UniversalCodesQueries {
    /// Query "universal codes" entry by code
    pub async fn entity(&self, _ctx: &Context<'_>, code: String) -> Result<EntityResponse> {
        let result = entity_by_code(code).await?;
        match result {
            Some(entity) => Ok(EntityResponse::Response(EntityType { entity })),
            None => Err("Not found".into()),
        }
    }
}

#[derive(Default, Clone)]
pub struct UserAccountMutations;

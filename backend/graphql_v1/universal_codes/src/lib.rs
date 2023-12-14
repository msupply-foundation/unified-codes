mod types;

use self::types::*;

use async_graphql::*;
use graphql_v1_core::ContextExt;

#[derive(Default, Clone)]
pub struct UniversalCodesQueries;

#[Object]
impl UniversalCodesQueries {
    /// Query "universal codes" entry by code
    pub async fn entity(&self, ctx: &Context<'_>, code: String) -> Result<Option<EntityType>> {
        let result = ctx
            .service_provider()
            .dgraph_service
            .entity_by_code(code)
            .await?;
        match result {
            Some(entity) => Ok(Some(EntityType::from_domain(entity))),
            None => Ok(None),
        }
    }
}

#[derive(Default, Clone)]
pub struct UserAccountMutations;

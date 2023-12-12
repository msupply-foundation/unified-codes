mod types;
use self::types::*;

use async_graphql::*;

#[derive(Default, Clone)]
pub struct UniversalCodesQueries;

#[Object]
impl UniversalCodesQueries {
    /// Query "universal codes" entry by code
    pub async fn entity(&self, _ctx: &Context<'_>, code: String) -> Result<EntityResponse> {
        let entity = EntityType {
            id: code.clone(),
            code: code,
            description: "TBD".to_string(),
        };

        Ok(EntityResponse::Response(entity))
    }
}

#[derive(Default, Clone)]
pub struct UserAccountMutations;

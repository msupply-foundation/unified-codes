mod types;

use self::types::*;

use async_graphql::*;
use dgraph::{entity_by_code, DgraphClient};

#[derive(Default, Clone)]
pub struct UniversalCodesQueries;

#[Object]
impl UniversalCodesQueries {
    /// Query "universal codes" entry by code
    pub async fn entity(&self, _ctx: &Context<'_>, code: String) -> Result<EntityResponse> {
        let tmp_client = DgraphClient::new("http://localhost:8080/graphql"); //TODO: FIXME
        let result = entity_by_code(&tmp_client, code).await?;
        match result {
            Some(entity) => Ok(EntityResponse::Response(EntityType::from_domain(entity))),
            None => Err("Not found".into()),
        }
    }
}

#[derive(Default, Clone)]
pub struct UserAccountMutations;

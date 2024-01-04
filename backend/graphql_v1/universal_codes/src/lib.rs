mod types;

pub use self::types::*;

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
            .universal_codes_service
            .entity_by_code(code)
            .await?;
        match result {
            Some(entity) => Ok(Some(EntityType::from_domain(entity))),
            None => Ok(None),
        }
    }

    // Query "universal codes" entries by search input
    pub async fn entities(
        &self,
        ctx: &Context<'_>,
        filter: EntitySearchInput,
        first: Option<u32>,
        offset: Option<u32>,
    ) -> Result<EntityCollectionType> {
        let result = ctx
            .service_provider()
            .universal_codes_service
            .entities(filter.into(), first, offset)
            .await?;

        let total_length = result.total_length;
        let data: Vec<EntityType> = result
            .data
            .into_iter()
            .map(EntityType::from_domain)
            .collect();

        Ok(EntityCollectionType { data, total_length })
    }
}

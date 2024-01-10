mod mutations;
use self::mutations::*;
pub mod types;
use self::types::*;

use async_graphql::*;
use graphql_core::pagination::PaginationInput;
use graphql_core::standard_graphql_error::validate_auth;
use graphql_core::ContextExt;
use graphql_types::types::*;
use service::auth::Resource;
use service::auth::ResourceAccessRequest;

#[derive(Default, Clone)]
pub struct UniversalCodesQueries;

#[Object]
impl UniversalCodesQueries {
    pub async fn pending_changes(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Pagination option (first and offset)")] page: Option<PaginationInput>,
        // #[graphql(desc = "Filter option")] filter: Option<PendingChangeFilterInput>,
        // #[graphql(desc = "Sort options (only first sort input is evaluated for this endpoint)")]
        // sort: Option<Vec<PendingChangeSortInput>>,
    ) -> Result<PendingChangesResponse> {
        let user = validate_auth(
            ctx,
            &ResourceAccessRequest {
                resource: Resource::QueryPendingChanges,
            },
        )?;

        let service_context = ctx.service_context(Some(&user))?;

        let pagination = match page {
            Some(page) => PaginationInput {
                first: page.first,
                offset: page.offset,
            },
            None => PaginationInput {
                first: None,
                offset: None,
            },
        };

        let pending_changes = service_context
            .service_provider
            .universal_codes_service
            .pending_changes(pagination.first, pagination.offset)
            .await?;

        Ok(PendingChangesResponse::Response(
            PendingChangeConnector::from_domain(pending_changes),
        ))
    }
}

#[derive(Default, Clone)]
pub struct UniversalCodesMutations;

#[Object]
impl UniversalCodesMutations {
    async fn upsert_entity(
        &self,
        ctx: &Context<'_>,
        input: UpsertEntityInput,
    ) -> Result<UpsertEntityResponse> {
        upsert_entity(ctx, input).await
    }
}

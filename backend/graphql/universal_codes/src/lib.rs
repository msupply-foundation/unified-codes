mod mutations;
use self::mutations::*;
pub mod types;
use self::types::*;

use async_graphql::*;
use graphql_core::pagination::PaginationInput;
use graphql_core::standard_graphql_error::validate_auth;
use graphql_core::ContextExt;
use graphql_types::types::*;
use graphql_universal_codes_v1::EntityType;
use service::auth::Resource;
use service::auth::ResourceAccessRequest;

#[derive(Default, Clone)]
pub struct UniversalCodesQueries;

#[Object]
impl UniversalCodesQueries {
    pub async fn pending_change(
        &self,
        ctx: &Context<'_>,
        request_id: String,
    ) -> Result<Option<PendingChangeNode>> {
        let user = validate_auth(
            ctx,
            &ResourceAccessRequest {
                resource: Resource::QueryPendingChanges,
            },
        )?;

        let service_context = ctx.service_context(Some(&user))?;

        let result = service_context
            .service_provider
            .universal_codes_service
            .pending_change(request_id)
            .await?;

        match result {
            Some(pending_change) => Ok(Some(PendingChangeNode::from_domain(pending_change))),
            None => Ok(None),
        }
    }

    pub async fn pending_changes(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Pagination option (first and offset)")] page: Option<PaginationInput>,
        // #[graphql(desc = "Filter option")] filter: Option<PendingChangeFilterInput>,
        #[graphql(desc = "Sort options (only first sort input is evaluated for this endpoint)")]
        sort: Option<Vec<PendingChangeSortInput>>,
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
            .pending_changes(
                pagination.first,
                pagination.offset,
                sort.and_then(|mut sort_list| sort_list.pop())
                    .map(|sort| sort.to_domain()),
            )
            .await?;

        Ok(PendingChangesResponse::Response(
            PendingChangeConnector::from_domain(pending_changes),
        ))
    }

    // Finds the product for a given code, with it's child nodes
    pub async fn product(&self, ctx: &Context<'_>, code: String) -> Result<Option<EntityType>> {
        let result = ctx
            .service_provider()
            .universal_codes_service
            .product_by_code(code)
            .await?;
        match result {
            Some(entity) => Ok(Some(EntityType::from_domain(entity))),
            None => Ok(None),
        }
    }
}

#[derive(Default, Clone)]
pub struct UniversalCodesMutations;

#[Object]
impl UniversalCodesMutations {
    async fn request_change(
        &self,
        ctx: &Context<'_>,
        input: RequestChangeInput,
    ) -> Result<RequestChangeResponse> {
        request_change(ctx, input).await
    }

    async fn update_pending_change(
        &self,
        ctx: &Context<'_>,
        request_id: String,
        body: String,
    ) -> Result<RequestChangeResponse> {
        update_pending_change(ctx, request_id, body).await
    }

    async fn approve_pending_change(
        &self,
        ctx: &Context<'_>,
        request_id: String,
        input: UpsertEntityInput,
    ) -> Result<UpsertEntityResponse> {
        approve_pending_change(ctx, request_id, input).await
    }

    async fn reject_pending_change(
        &self,
        ctx: &Context<'_>,
        request_id: String,
    ) -> Result<IdResponse> {
        reject_pending_change(ctx, request_id).await
    }
}

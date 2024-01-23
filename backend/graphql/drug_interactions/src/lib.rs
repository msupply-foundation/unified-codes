mod mutations;
use self::mutations::*;
mod types;
use self::types::*;

use async_graphql::*;
use graphql_core::standard_graphql_error::validate_auth;
use graphql_core::ContextExt;
use service::auth::Resource;
use service::auth::ResourceAccessRequest;

#[derive(Default, Clone)]
pub struct DrugInteractionQueries;

#[Object]
impl DrugInteractionQueries {
    /// Get the configuration items for a given type.
    pub async fn all_drug_interaction_groups(
        &self,
        ctx: &Context<'_>,
    ) -> Result<DrugInteractionGroupsResponse> {
        let user = validate_auth(
            ctx,
            &ResourceAccessRequest {
                resource: Resource::MutateUniversalCodes,
            },
        )?;

        let service_context = ctx.service_context(Some(&user))?;

        let result = service_context
            .service_provider
            .drug_interaction_service
            .all_drug_interaction_groups()
            .await?;

        Ok(DrugInteractionGroupsResponse::Response(
            DrugInteractionGroupConnector::from_domain(result),
        ))
    }
}

#[derive(Default, Clone)]
pub struct DrugInteractionMutations;

#[Object]
impl DrugInteractionMutations {
    async fn add_drug_interaction_group(
        &self,
        ctx: &Context<'_>,
        input: AddDrugInteractionGroupInput,
    ) -> Result<u32> {
        add_drug_interaction_group(ctx, input).await
    }

    async fn delete_drug_interaction_group(&self, ctx: &Context<'_>, code: String) -> Result<u32> {
        delete_drug_interaction_group(ctx, code).await
    }
}

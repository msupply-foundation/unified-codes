mod mutations;
use self::mutations::*;
mod types;
use self::types::*;

use async_graphql::*;
use graphql_core::ContextExt;

#[derive(Default, Clone)]
pub struct DrugInteractionQueries;

#[Object]
impl DrugInteractionQueries {
    /// Get all the drug interaction groups, no pagination as we assume it won't get too big...
    pub async fn all_drug_interaction_groups(
        &self,
        ctx: &Context<'_>,
    ) -> Result<DrugInteractionGroupsResponse> {
        let service_context = ctx.service_context(None)?;

        let result = service_context
            .service_provider
            .drug_interaction_service
            .all_drug_interaction_groups()
            .await?;

        Ok(DrugInteractionGroupsResponse::Response(
            DrugInteractionGroupConnector::from_domain(result),
        ))
    }

    /// Get all the drug interactions, no pagination as we assume it won't get too big...
    pub async fn all_drug_interactions(
        &self,
        ctx: &Context<'_>,
    ) -> Result<DrugInteractionsResponse> {
        let service_context = ctx.service_context(None)?;

        let result = service_context
            .service_provider
            .drug_interaction_service
            .all_drug_interactions()
            .await?;

        Ok(DrugInteractionsResponse::Response(
            DrugInteractionConnector::from_domain(result),
        ))
    }
}

#[derive(Default, Clone)]
pub struct DrugInteractionMutations;

#[Object]
impl DrugInteractionMutations {
    async fn upsert_drug_interaction_group(
        &self,
        ctx: &Context<'_>,
        input: UpsertDrugInteractionGroupInput,
    ) -> Result<u32> {
        upsert_drug_interaction_group(ctx, input).await
    }

    async fn delete_drug_interaction_group(&self, ctx: &Context<'_>, code: String) -> Result<u32> {
        delete_drug_interaction_group(ctx, code).await
    }

    async fn upsert_drug_interaction(
        &self,
        ctx: &Context<'_>,
        input: UpsertDrugInteractionInput,
    ) -> Result<u32> {
        upsert_drug_interaction(ctx, input).await
    }

    async fn delete_drug_interaction(&self, ctx: &Context<'_>, code: String) -> Result<u32> {
        delete_drug_interaction(ctx, code).await
    }
}

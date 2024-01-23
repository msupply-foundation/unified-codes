use async_graphql::*;

use graphql_core::{
    standard_graphql_error::{validate_auth, StandardGraphqlError},
    ContextExt,
};

use service::{
    auth::{Resource, ResourceAccessRequest},
    drug_interactions::ModifyDrugInteractionError,
};

use crate::types::AddDrugInteractionGroupInput;

pub async fn add_drug_interaction_group(
    ctx: &Context<'_>,
    input: AddDrugInteractionGroupInput,
) -> Result<u32> {
    let user = validate_auth(
        ctx,
        &ResourceAccessRequest {
            resource: Resource::MutateUniversalCodes,
        },
    )?;

    let service_context = ctx.service_context(Some(&user))?;
    match service_context
        .service_provider
        .drug_interaction_service
        .add_drug_interaction_group(
            ctx.service_provider(),
            service_context.user_id.clone(),
            input.into(),
        )
        .await
    {
        Ok(affected_items) => Ok(affected_items),
        Err(error) => map_error(error),
    }
}

fn map_error(error: ModifyDrugInteractionError) -> Result<u32> {
    use StandardGraphqlError::*;
    let formatted_error = format!("{:#?}", error);

    let graphql_error = match error {
        ModifyDrugInteractionError::InternalError(message) => InternalError(message),
        ModifyDrugInteractionError::DatabaseError(_) => InternalError(formatted_error),
        ModifyDrugInteractionError::DgraphError(gql_error) => {
            InternalError(format!("{:#?} - {:?}", gql_error, gql_error.json()))
        }
    };

    Err(graphql_error.extend())
}

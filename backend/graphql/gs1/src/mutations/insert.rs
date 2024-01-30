use async_graphql::*;

use graphql_core::{standard_graphql_error::validate_auth, ContextExt};

use service::auth::{Resource, ResourceAccessRequest};

use crate::{
    map_modify_gs1_error,
    types::{AddGS1Input, GS1Node, GS1Response},
};

pub async fn add_gs1(ctx: &Context<'_>, input: AddGS1Input) -> Result<GS1Response> {
    let user = validate_auth(
        ctx,
        &ResourceAccessRequest {
            resource: Resource::MutateUniversalCodes,
        },
    )?;

    let service_context = ctx.service_context(Some(&user))?;
    match service_context
        .service_provider
        .gs1_service
        .add_gs1(
            ctx.service_provider(),
            service_context.user_id.clone(),
            input.into(),
        )
        .await
    {
        Ok(gs1) => Ok(GS1Response::Response(GS1Node::from_domain(gs1))),
        Err(error) => map_modify_gs1_error(error),
    }
}

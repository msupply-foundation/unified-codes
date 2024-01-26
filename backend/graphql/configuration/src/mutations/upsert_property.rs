use async_graphql::*;

use graphql_core::{standard_graphql_error::validate_auth, ContextExt};

use service::auth::{Resource, ResourceAccessRequest};

use crate::{map_modify_config_error, UpsertPropertyConfigItemInput};

pub async fn upsert_property_configuration_item(
    ctx: &Context<'_>,
    input: UpsertPropertyConfigItemInput,
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
        .configuration_service
        .upsert_property_configuration_item(
            ctx.service_provider(),
            service_context.user_id.clone(),
            input.into(),
        )
        .await
    {
        Ok(affected_items) => Ok(affected_items),
        Err(error) => map_modify_config_error(error),
    }
}

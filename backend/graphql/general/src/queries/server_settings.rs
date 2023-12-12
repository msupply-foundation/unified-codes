use async_graphql::*;
use graphql_core::{
    standard_graphql_error::{validate_auth, StandardGraphqlError},
    ContextExt,
};
use serde::Serialize;
use service::auth::{Resource, ResourceAccessRequest};

// TODO find a better place, e.g. merge with getApiVersion?
#[derive(Enum, Copy, Clone, PartialEq, Eq, Debug, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")] // only needed to be comparable in tests
pub enum ServerStatus {
    /// Server misses configuration to start up fully
    Running,
}

#[derive(Debug)]
pub struct RestartNode {}

#[Object]
impl RestartNode {
    async fn message(&self) -> &'static str {
        "Restarting"
    }
}

pub async fn server_restart(ctx: &Context<'_>) -> Result<RestartNode> {
    validate_auth(
        ctx,
        &ResourceAccessRequest {
            resource: Resource::ServerAdmin,
        },
    )?;

    match ctx.restart_switch().send(true).await {
        Ok(_) => Ok(RestartNode {}),
        Err(err) => {
            let formatted_error = format!("{:#?}", err);
            let graphql_error = StandardGraphqlError::InternalError(formatted_error);
            Err(graphql_error.extend())
        }
    }
}

pub mod mutations;
mod queries;
use self::queries::*;

use async_graphql::*;
use graphql_core::pagination::PaginationInput;
use queries::server_settings::{server_restart, RestartNode};

#[derive(Default, Clone)]
pub struct GeneralQueries;

#[Object]
impl GeneralQueries {
    #[allow(non_snake_case)]
    pub async fn apiVersion(&self) -> String {
        "1.0".to_string()
    }

    /// Retrieves a new auth bearer and refresh token
    /// The refresh token is returned as a cookie
    pub async fn auth_token(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "UserName")] username: String,
        #[graphql(desc = "Password")] password: String,
    ) -> Result<AuthTokenResponse> {
        login(ctx, &username, &password).await
    }

    pub async fn logout(&self, ctx: &Context<'_>) -> LogoutResponse {
        logout(ctx)
    }

    /// Retrieves a new auth bearer and refresh token
    /// The refresh token is returned as a cookie
    pub async fn refresh_token(&self, ctx: &Context<'_>) -> RefreshTokenResponse {
        refresh_token(ctx)
    }

    pub async fn me(&self, ctx: &Context<'_>) -> Result<UserResponse> {
        me(ctx)
    }
    pub async fn logs(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Pagination option (first and offset)")] page: Option<PaginationInput>,
        #[graphql(desc = "Filter option")] filter: Option<LogFilterInput>,
        #[graphql(desc = "Sort options (only first sort input is evaluated for this endpoint)")]
        sort: Option<Vec<LogSortInput>>,
    ) -> Result<LogResponse> {
        logs(ctx, page, filter, sort)
    }
}

#[derive(Default, Clone)]
pub struct ServerAdminQueries;

#[Object]
impl ServerAdminQueries {
    /// Restarts the server
    pub async fn server_restart(&self, ctx: &Context<'_>) -> Result<RestartNode> {
        server_restart(ctx).await
    }
}

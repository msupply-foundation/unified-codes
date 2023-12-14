use super::{dataloader::DataLoader, LogNode};
use async_graphql::{Context, Enum, Object, SimpleObject, Union};
use graphql_core::{
    loader::{AuditLogLoader, UserPermissionLoader},
    simple_generic_errors::NodeError,
    ContextExt,
};
use repository::{Permission, UserAccount, UserAccountRow};
use serde::Serialize;
use service::ListResult;
use util::usize_to_u32;

#[derive(Union)]
pub enum UserAccountsResponse {
    Response(UserAccountConnector),
}

#[derive(Union)]
pub enum UserAccountResponse {
    Error(NodeError),
    Response(UserAccountNode),
}

#[derive(PartialEq, Debug, Clone)]
pub struct UserAccountNode {
    pub user_account: UserAccount,
}

#[Object]
impl UserAccountNode {
    pub async fn id(&self) -> &str {
        &self.row().id
    }
    pub async fn username(&self) -> &str {
        &self.row().username
    }
    pub async fn display_name(&self) -> &str {
        &self.row().display_name
    }
    pub async fn email(&self) -> &Option<String> {
        &self.row().email
    }

    pub async fn permissions(
        &self,
        ctx: &Context<'_>,
    ) -> Result<Vec<PermissionNode>, async_graphql::Error> {
        let loader = ctx.get_loader::<DataLoader<UserPermissionLoader>>();
        let result = loader
            .load_one(self.row().id.to_string())
            .await?
            .unwrap_or_default();

        Ok(result
            .into_iter()
            .map(PermissionNode::from_domain)
            .collect())
    }

    pub async fn audit_logs(
        &self,
        ctx: &Context<'_>,
    ) -> Result<Vec<LogNode>, async_graphql::Error> {
        let loader = ctx.get_loader::<DataLoader<AuditLogLoader>>();
        let result = loader
            .load_one(self.row().id.to_string())
            .await?
            .unwrap_or_default();

        Ok(result.into_iter().map(LogNode::from_domain).collect())
    }
}

impl UserAccountNode {
    pub fn from_domain(user_account: UserAccount) -> UserAccountNode {
        UserAccountNode { user_account }
    }

    pub fn row(&self) -> &UserAccountRow {
        &self.user_account
    }
}

#[derive(SimpleObject)]
pub struct UserAccountConnector {
    total_count: u32,
    nodes: Vec<UserAccountNode>,
}

impl UserAccountConnector {
    pub fn from_domain(user_accounts: ListResult<UserAccount>) -> UserAccountConnector {
        UserAccountConnector {
            total_count: user_accounts.count,
            nodes: user_accounts
                .rows
                .into_iter()
                .map(UserAccountNode::from_domain)
                .collect(),
        }
    }

    pub fn from_vec(user_accounts: Vec<UserAccount>) -> UserAccountConnector {
        UserAccountConnector {
            total_count: usize_to_u32(user_accounts.len()),
            nodes: user_accounts
                .into_iter()
                .map(UserAccountNode::from_domain)
                .collect(),
        }
    }
}

#[derive(Enum, Copy, Clone, PartialEq, Eq, Debug, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum PermissionNode {
    ServerAdmin,
    Reader,
}
impl PermissionNode {
    pub fn to_domain(self) -> Permission {
        match self {
            PermissionNode::ServerAdmin => Permission::ServerAdmin,
            PermissionNode::Reader => Permission::Reader,
        }
    }

    pub fn from_domain(perm: Permission) -> PermissionNode {
        match perm {
            Permission::ServerAdmin => PermissionNode::ServerAdmin,
            Permission::Reader => PermissionNode::Reader,
        }
    }
}

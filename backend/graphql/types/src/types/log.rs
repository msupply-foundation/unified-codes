use async_graphql::{dataloader::DataLoader, *};
use chrono::{DateTime, Utc};
use graphql_core::{loader::UserLoader, ContextExt};
use repository::{AuditLog, AuditLogRow, LogType};
use service::ListResult;

use super::UserAccountNode;

#[derive(PartialEq, Debug)]
pub struct LogNode {
    log: AuditLog,
}

#[derive(SimpleObject)]
pub struct LogConnector {
    total_count: u32,
    nodes: Vec<LogNode>,
}

#[derive(Enum, Copy, Clone, PartialEq, Eq)]
pub enum LogNodeType {
    UserLoggedIn,
    UserAccountCreated,
    UserAccountUpdated,
    UserAccountPasswordResetInitiated,
}

#[Object]
impl LogNode {
    pub async fn id(&self) -> &str {
        &self.row().id
    }

    pub async fn record_type(&self) -> LogNodeType {
        LogNodeType::from_domain(&self.row().record_type)
    }

    pub async fn record_id(&self) -> &Option<String> {
        &self.row().record_id
    }

    pub async fn datetime(&self) -> DateTime<Utc> {
        DateTime::<Utc>::from_utc(self.row().datetime, Utc)
    }

    pub async fn user(&self, ctx: &Context<'_>) -> Result<Option<UserAccountNode>> {
        let loader = ctx.get_loader::<DataLoader<UserLoader>>();

        let user_id = match &self.row().user_id {
            Some(user_id) => user_id,
            None => return Ok(None),
        };

        match loader.load_one(user_id.clone()).await? {
            Some(user) => Ok(Some(UserAccountNode::from_domain(user))),
            None => Ok(None),
        }
    }
}

impl LogNode {
    pub fn from_domain(log: AuditLog) -> Self {
        LogNode { log }
    }

    pub fn row(&self) -> &AuditLogRow {
        &self.log.log_row
    }
}

impl LogNodeType {
    pub fn from_domain(from: &LogType) -> LogNodeType {
        match from {
            LogType::UserLoggedIn => LogNodeType::UserLoggedIn,
            LogType::UserAccountCreated => LogNodeType::UserAccountCreated,
            LogType::UserAccountUpdated => LogNodeType::UserAccountUpdated,
            LogType::UserAccountPasswordResetInitiated => {
                LogNodeType::UserAccountPasswordResetInitiated
            }
        }
    }

    pub fn to_domain(self) -> LogType {
        match self {
            LogNodeType::UserLoggedIn => LogType::UserLoggedIn,
            LogNodeType::UserAccountCreated => LogType::UserAccountCreated,
            LogNodeType::UserAccountUpdated => LogType::UserAccountUpdated,
            LogNodeType::UserAccountPasswordResetInitiated => {
                LogType::UserAccountPasswordResetInitiated
            }
        }
    }
}

impl LogConnector {
    pub fn from_domain(logs: ListResult<AuditLog>) -> LogConnector {
        LogConnector {
            total_count: logs.count,
            nodes: logs
                .rows
                .into_iter()
                .map(|log| LogNode::from_domain(log))
                .collect(),
        }
    }
}

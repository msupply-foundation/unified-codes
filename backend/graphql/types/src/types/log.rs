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
    UniversalCodeCreated,
    UniversalCodeUpdated,
    UniversalCodeChangeApproved,
    UniversalCodeChangeRejected,
    UniversalCodeChangeRequested,
    ConfigurationItemCreated,
    ConfigurationItemDeleted,
    PropertyConfigurationItemUpserted,
    InteractionGroupCreated,
    InteractionGroupDeleted,
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
        DateTime::<Utc>::from_naive_utc_and_offset(self.row().datetime, Utc)
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
            LogType::UniversalCodeCreated => LogNodeType::UniversalCodeCreated,
            LogType::UniversalCodeUpdated => LogNodeType::UniversalCodeUpdated,
            LogType::UniversalCodeChangeRequested => LogNodeType::UniversalCodeChangeRequested,
            LogType::UniversalCodeChangeApproved => LogNodeType::UniversalCodeChangeApproved,
            LogType::UniversalCodeChangeRejected => LogNodeType::UniversalCodeChangeRejected,
            LogType::ConfigurationItemCreated => LogNodeType::ConfigurationItemCreated,
            LogType::ConfigurationItemDeleted => LogNodeType::ConfigurationItemDeleted,
            LogType::PropertyConfigurationItemUpserted => {
                LogNodeType::PropertyConfigurationItemUpserted
            }
            LogType::InteractionGroupCreated => LogNodeType::InteractionGroupCreated,
            LogType::InteractionGroupDeleted => LogNodeType::InteractionGroupDeleted,
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
            LogNodeType::UniversalCodeCreated => LogType::UniversalCodeCreated,
            LogNodeType::UniversalCodeUpdated => LogType::UniversalCodeUpdated,
            LogNodeType::UniversalCodeChangeRequested => LogType::UniversalCodeChangeRequested,
            LogNodeType::UniversalCodeChangeApproved => LogType::UniversalCodeChangeApproved,
            LogNodeType::UniversalCodeChangeRejected => LogType::UniversalCodeChangeRejected,
            LogNodeType::ConfigurationItemCreated => LogType::ConfigurationItemCreated,
            LogNodeType::ConfigurationItemDeleted => LogType::ConfigurationItemDeleted,
            LogNodeType::PropertyConfigurationItemUpserted => {
                LogType::PropertyConfigurationItemUpserted
            }
            LogNodeType::InteractionGroupCreated => LogType::InteractionGroupCreated,
            LogNodeType::InteractionGroupDeleted => LogType::InteractionGroupDeleted,
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

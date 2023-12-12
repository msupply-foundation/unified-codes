use crate::loader::UserLoader;
use actix_web::web::Data;
use anymap::{any::Any, Map};
use async_graphql::dataloader::DataLoader;
use repository::StorageConnectionManager;
use service::service_provider::ServiceProvider;

use super::{user_permission::UserPermissionLoader, AuditLogLoader};

pub type LoaderMap = Map<AnyLoader>;
pub type AnyLoader = dyn Any + Send + Sync;

pub struct LoaderRegistry {
    pub loaders: LoaderMap,
}

impl LoaderRegistry {
    pub fn get<T: anymap::any::Any + Send + Sync>(&self) -> &T {
        match self.loaders.get::<T>() {
            Some(loader) => loader,
            None => unreachable!("{} not found", std::any::type_name::<T>()),
        }
    }
}

pub async fn get_loaders(
    connection_manager: &StorageConnectionManager,
    _service_provider: Data<ServiceProvider>,
) -> LoaderMap {
    let mut loaders: LoaderMap = LoaderMap::new();

    let user_account_loader = DataLoader::new(
        UserLoader {
            connection_manager: connection_manager.clone(),
        },
        async_std::task::spawn,
    );
    loaders.insert(user_account_loader);

    let user_permission_loader = DataLoader::new(
        UserPermissionLoader {
            connection_manager: connection_manager.clone(),
        },
        async_std::task::spawn,
    );
    loaders.insert(user_permission_loader);

    let audit_log_loader = DataLoader::new(
        AuditLogLoader {
            connection_manager: connection_manager.clone(),
        },
        async_std::task::spawn,
    );
    loaders.insert(audit_log_loader);

    loaders
}

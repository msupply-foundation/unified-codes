use actix_web::web::Data;
use anymap::{any::Any, Map};
use async_graphql::dataloader::DataLoader;

use service::service_provider::ServiceProvider;

use super::ProductLoader;

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

pub async fn get_loaders_v1(service_provider: Data<ServiceProvider>) -> LoaderMap {
    let mut loaders: LoaderMap = LoaderMap::new();

    let dgraph_client = service_provider.dgraph_client();

    let product_loader = DataLoader::new(
        ProductLoader {
            dgraph_client: dgraph_client.clone(),
        },
        async_std::task::spawn,
    );
    loaders.insert(product_loader);

    loaders
}

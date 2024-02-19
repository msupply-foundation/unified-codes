use std::sync::Arc;

use actix_web::web::Data;
use async_graphql::Context;

pub mod loader;

use loader::LoaderRegistry;
use service::service_provider::ServiceProvider;

#[allow(clippy::borrowed_box)]
// Sugar that helps make things neater and avoid errors that would only crop up at runtime.
pub trait ContextExt {
    fn service_provider(&self) -> Arc<ServiceProvider>;
    fn get_loader_v1<T: anymap::any::Any + Send + Sync>(&self) -> &T;
}

impl<'a> ContextExt for Context<'a> {
    fn get_loader_v1<T: anymap::any::Any + Send + Sync>(&self) -> &T {
        self.data_unchecked::<Data<LoaderRegistry>>().get::<T>()
    }

    fn service_provider(&self) -> Arc<ServiceProvider> {
        self.data_unchecked::<Data<ServiceProvider>>()
            .clone()
            .into_inner()
    }
}

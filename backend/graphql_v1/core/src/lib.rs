use std::sync::Arc;

use actix_web::web::Data;
use async_graphql::Context;

use service::service_provider::ServiceProvider;

#[allow(clippy::borrowed_box)]
// Sugar that helps make things neater and avoid errors that would only crop up at runtime.
pub trait ContextExt {
    fn service_provider(&self) -> Arc<ServiceProvider>;
}

impl<'a> ContextExt for Context<'a> {
    fn service_provider(&self) -> Arc<ServiceProvider> {
        self.data_unchecked::<Data<ServiceProvider>>()
            .clone()
            .into_inner()
    }
}

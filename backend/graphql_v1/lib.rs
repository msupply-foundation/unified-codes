#![allow(clippy::too_many_arguments)]

mod logger;

use actix_web::guard;
use actix_web::web::{self, Data};
use actix_web::HttpResponse;
use async_graphql::{EmptyMutation, EmptySubscription, MergedObject, SchemaBuilder};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use graphql_universal_codes_v1::UniversalCodesV1Queries;

use logger::{RequestLogger, ResponseLogger};
use repository::StorageConnectionManager;
use service::service_provider::ServiceProvider;
use service::settings::Settings;

#[derive(MergedObject, Default, Clone)]
pub struct FullQuery(pub UniversalCodesV1Queries);

#[derive(MergedObject, Default, Clone)]
pub struct FullMutation(pub UniversalCodesV1Queries);

pub type Schema = async_graphql::Schema<FullQuery, EmptyMutation, async_graphql::EmptySubscription>;
type Builder = SchemaBuilder<FullQuery, EmptyMutation, EmptySubscription>;

pub fn full_query() -> FullQuery {
    FullQuery(UniversalCodesV1Queries)
}

pub fn schema_builder() -> Builder {
    Schema::build(full_query(), EmptyMutation, EmptySubscription)
}

pub fn build_schema(
    connection_manager: Data<StorageConnectionManager>,
    service_provider: Data<ServiceProvider>,
    settings_data: Data<Settings>,
    include_logger: bool,
) -> Schema {
    let mut builder = schema_builder()
        .data(connection_manager)
        .data(service_provider)
        .data(settings_data);

    if include_logger {
        builder = builder.extension(RequestLogger).extension(ResponseLogger);
    }

    builder.finish()
}

pub fn config(
    connection_manager: Data<StorageConnectionManager>,
    service_provider: Data<ServiceProvider>,
    settings_data: Data<Settings>,
) -> impl FnOnce(&mut actix_web::web::ServiceConfig) {
    |cfg| {
        let schema = build_schema(connection_manager, service_provider, settings_data, true);

        cfg.app_data(Data::new(schema))
            .service(
                web::resource("/v1/graphql")
                    .guard(guard::Post())
                    .to(graphql),
            )
            .service(
                web::resource("/v1/graphql")
                    .guard(guard::Get())
                    .to(playground),
            );
    }
}

async fn playground() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(include_str!("playground.html"))
}

async fn graphql(schema: Data<Schema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

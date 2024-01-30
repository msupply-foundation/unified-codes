#![allow(clippy::too_many_arguments)]

mod logger;

use actix_web::web::{self, Data, ReqData};
use actix_web::HttpResponse;
use actix_web::{guard, HttpRequest};
use async_graphql::{EmptySubscription, MergedObject, SchemaBuilder};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use graphql_configuration::{ConfigurationMutations, ConfigurationQueries};
use graphql_core::loader::LoaderRegistry;
use graphql_core::{refresh_token_from_cookie, RefreshTokenData, SelfRequest};
use graphql_general::GeneralQueries;
use graphql_universal_codes::{UniversalCodesMutations, UniversalCodesQueries};
use graphql_universal_codes_v1::UniversalCodesV1Queries;
use graphql_user_account::{UserAccountMutations, UserAccountQueries};

use logger::{RequestLogger, ResponseLogger};
use repository::StorageConnectionManager;
use service::auth_data::{AuthData, AuthenticationContext};
use service::service_provider::ServiceProvider;
use service::settings::Settings;
use tokio::sync::mpsc::Sender;

#[derive(MergedObject, Default, Clone)]
pub struct FullQuery(
    pub GeneralQueries,
    pub UserAccountQueries,
    pub UniversalCodesQueries,
    pub UniversalCodesV1Queries,
    pub ConfigurationQueries,
);

#[derive(MergedObject, Default, Clone)]
pub struct FullMutation(
    pub UserAccountMutations,
    pub UniversalCodesMutations,
    pub ConfigurationMutations,
);

pub type Schema = async_graphql::Schema<FullQuery, FullMutation, async_graphql::EmptySubscription>;
type Builder = SchemaBuilder<FullQuery, FullMutation, EmptySubscription>;

pub fn full_query() -> FullQuery {
    FullQuery(
        GeneralQueries,
        UserAccountQueries,
        UniversalCodesQueries,
        UniversalCodesV1Queries,
        ConfigurationQueries,
    )
}

pub fn full_mutation() -> FullMutation {
    FullMutation(
        UserAccountMutations,
        UniversalCodesMutations,
        ConfigurationMutations,
    )
}

pub fn schema_builder() -> Builder {
    Schema::build(full_query(), full_mutation(), EmptySubscription)
}

pub fn build_schema(
    connection_manager: Data<StorageConnectionManager>,
    loader_registry: Data<LoaderRegistry>,
    service_provider: Data<ServiceProvider>,
    auth_data: Data<AuthData>,
    settings_data: Data<Settings>,
    restart_switch: Data<Sender<bool>>,
    self_request: Option<Data<Box<dyn SelfRequest>>>,
    include_logger: bool,
) -> Schema {
    let mut builder = schema_builder()
        .data(connection_manager)
        .data(loader_registry)
        .data(service_provider)
        .data(auth_data)
        .data(settings_data)
        .data(restart_switch);

    if let Some(self_request) = self_request {
        builder = builder.data(self_request)
    }

    if include_logger {
        builder = builder.extension(RequestLogger).extension(ResponseLogger);
    }

    builder.finish()
}

struct SelfRequestImpl {
    schema: Schema,
}
#[async_trait::async_trait]
impl SelfRequest for SelfRequestImpl {
    async fn call(
        &self,
        request: async_graphql::Request,
        user_data: RefreshTokenData,
    ) -> async_graphql::Response {
        let query = request.data(user_data);
        self.schema.execute(query).await
    }
}

pub fn config(
    connection_manager: Data<StorageConnectionManager>,
    loader_registry: Data<LoaderRegistry>,
    service_provider: Data<ServiceProvider>,
    auth_data: Data<AuthData>,
    settings_data: Data<Settings>,
    restart_switch: Data<Sender<bool>>,
) -> impl FnOnce(&mut actix_web::web::ServiceConfig) {
    |cfg| {
        let self_requester: Data<Box<dyn SelfRequest>> = Data::new(Box::new(SelfRequestImpl {
            schema: build_schema(
                connection_manager.clone(),
                loader_registry.clone(),
                service_provider.clone(),
                auth_data.clone(),
                settings_data.clone(),
                restart_switch.clone(),
                None,
                false,
            ),
        }));

        let schema = build_schema(
            connection_manager,
            loader_registry,
            service_provider,
            auth_data,
            settings_data,
            restart_switch,
            Some(self_requester),
            true,
        );

        cfg.app_data(Data::new(schema))
            .service(web::resource("/graphql").guard(guard::Post()).to(graphql))
            .service(web::resource("/graphql").guard(guard::Get()).to(playground));
    }
}

async fn playground() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(include_str!("playground.html"))
}

async fn graphql(
    schema: Data<Schema>,
    req: GraphQLRequest,
    auth_context: Option<ReqData<AuthenticationContext>>,
    http_req: HttpRequest,
) -> GraphQLResponse {
    log::debug!("Graphql Auth Context: {:?}", auth_context);
    let query = match auth_context {
        Some(auth_context) => req.into_inner().data(auth_context.into_inner()),
        None => req.into_inner(),
    };

    let refresh_token = refresh_token_from_cookie(&http_req);
    log::debug!("Graphql Refresh Token: {:?}", refresh_token);
    let query = query.data(refresh_token);

    schema.execute(query).await.into()
}

#[cfg(test)]
mod test {
    use graphql_core::{assert_graphql_query, test_helpers::setup_graphql_test};
    use repository::mock::MockDataInserts;
    use serde_json::json;

    use crate::{full_mutation, full_query};

    #[actix_rt::test]
    async fn test_graphql_version() {
        // This test should also checks that there are no duplicate types (which will be a panic when schema is built)
        let (_, _, _, settings) = setup_graphql_test(
            full_query(),
            full_mutation(),
            "graphql_lib",
            MockDataInserts::none(),
        )
        .await;
        let expected = json!({
            "apiVersion": "1.0"
        });

        let query = r#"
        query {
            apiVersion
        }
        "#;

        assert_graphql_query!(&settings, query, &None, expected, None);
    }
}

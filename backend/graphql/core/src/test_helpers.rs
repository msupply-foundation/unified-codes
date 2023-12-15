use crate::loader::{get_loaders, LoaderRegistry};
use actix_web::{
    dev::Service,
    guard,
    web::{self, Data, ReqData},
    HttpMessage,
};
use async_graphql::{EmptySubscription, ObjectType, Schema};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use repository::{
    mock::{MockData, MockDataCollection, MockDataInserts},
    test_db::setup_all_with_data,
    Permission, StorageConnection, StorageConnectionManager, UserAccountRow, UserPermissionRow,
};
use service::{auth_data::AuthData, service_provider::ServiceProvider, token_bucket::TokenBucket};
use service::{auth_data::AuthenticationContext, test_utils::get_test_settings};
use std::sync::{Arc, RwLock};

pub struct TestGraphqlSettings<Q: 'static + ObjectType + Clone, M: 'static + ObjectType + Clone> {
    pub queries: Q,
    pub mutations: M,
    pub connection_manager: StorageConnectionManager,
    pub authentication_context: AuthenticationContext,
}

pub async fn run_test_gql_query<
    Q: 'static + ObjectType + Clone,
    M: 'static + ObjectType + Clone,
>(
    settings: &TestGraphqlSettings<Q, M>,
    query: &str,
    variables: &Option<serde_json::Value>,
    service_provider_override: Option<ServiceProvider>,
) -> serde_json::Value {
    let connection_manager = settings.connection_manager.clone();
    let connection_manager_data = Data::new(connection_manager.clone());

    let service_provider_data = Data::new(match service_provider_override {
        Some(service_provider) => service_provider,
        None => ServiceProvider::new(
            connection_manager.clone(),
            get_test_settings("run_test_gql_query"),
        ),
    });

    let loaders = get_loaders(&connection_manager, service_provider_data.clone()).await;
    let loader_registry_data = actix_web::web::Data::new(LoaderRegistry { loaders });

    let auth_data = Data::new(AuthData {
        auth_token_secret: "n/a".to_string(),
        token_bucket: Arc::new(RwLock::new(TokenBucket::new())),
    });

    let auth_context = settings.authentication_context.clone();

    let app = actix_web::test::init_service(
        actix_web::App::new()
            .wrap_fn(move |req, srv| {
                // This wrap_fn is the equivalent of the AddAuthenticationContext Middleware
                // It always applies the AuthenticationContext set in the TestGraphqlSettings
                req.extensions_mut().insert(auth_context.clone());
                srv.call(req)
            })
            .app_data(Data::new(
                Schema::build(
                    settings.queries.clone(),
                    settings.mutations.clone(),
                    EmptySubscription,
                )
                .data(connection_manager_data.clone())
                .data(loader_registry_data.clone())
                .data(service_provider_data.clone())
                .data(auth_data.clone())
                .finish(),
            ))
            .service(web::resource("/graphql").guard(guard::Post()).to(
                |schema: Data<Schema<Q, M, EmptySubscription>>,
                 req: GraphQLRequest,
                 auth_context: Option<ReqData<AuthenticationContext>>| {
                    graphql(schema, req, auth_context)
                },
            )),
    )
    .await;

    let mut payload: String;
    if let Some(variables) = variables {
        payload = format!("{{\"query\":\"{}\",\"variables\":{}}}", query, variables);
    } else {
        payload = format!("{{\"query\":\"{}\"}}", query);
    }
    payload = payload.replace('\n', "");

    let req = actix_web::test::TestRequest::post()
        .set_payload(payload)
        .uri("/graphql")
        .to_request();

    actix_web::test::call_and_read_body_json(&app, req).await
}

async fn graphql<Query: 'static + ObjectType + Clone, Mutation: 'static + ObjectType + Clone>(
    schema: Data<Schema<Query, Mutation, EmptySubscription>>,
    req: GraphQLRequest,
    auth_context: Option<ReqData<AuthenticationContext>>,
) -> GraphQLResponse {
    let query = match auth_context {
        Some(auth_context) => req.into_inner().data(auth_context.into_inner()),
        None => req.into_inner(),
    };

    schema.execute(query).await.into()
}

// TODO should really re-export dev deps (actix_rt, assert_json_dif, to avoid need to import in consumer)
#[macro_export]
macro_rules! assert_graphql_query {
    ($settings:expr, $query:expr, $variables:expr, $expected_inner:expr, $service_provider_override:expr) => {{
        let actual = graphql_core::test_helpers::run_test_gql_query(
            $settings,
            $query,
            $variables,
            $service_provider_override,
        )
        .await;

        match actual.get("errors").and_then(serde_json::Value::as_array) {
            Some(errors) => {
                if !errors.is_empty() {
                    panic!("Request failed with standard error(s): {}",
                        serde_json::to_string_pretty(errors).unwrap());
                }
            },
            None => {}
        }
        let expected = serde_json::json!(
            {
                "data": $expected_inner,
            }
        );

        // Inclusive means only match fields in rhs against lhs (lhs can have more fields)
        let config = assert_json_diff::Config::new(assert_json_diff::CompareMode::Inclusive);

        match assert_json_diff::assert_json_matches_no_panic(&actual, &expected, config) {
            Ok(_) => assert!(true),
            Err(error) => {
                panic!(
                    "\n{}\n**actual**\n{}\n**expected**\n{}\n**query**\n{}",
                    error,
                    serde_json::to_string_pretty(&actual).unwrap(),
                    serde_json::to_string_pretty(&expected).unwrap(),
                    $query
                );
            }
        }
    }};
}

#[macro_export]
macro_rules! assert_standard_graphql_error {
    // expected_extensions should be an Option<serde_json::json>>
    ($settings:expr, $query:expr, $variables:expr, $expected_message:expr, $expected_extensions:expr, $service_provider_override:expr) => {{
        let actual = graphql_core::test_helpers::run_test_gql_query(
            $settings,
            $query,
            $variables,
            $service_provider_override,
        )
        .await;

        let expected_with_message = serde_json::json!(
            {
                "errors": [{
                    "message": $expected_message,
                    // Need to check that extensions are indeed present,
                    // and if expected_extensions is not, None check content of extensions
                    "extensions": $expected_extensions.unwrap_or(serde_json::json!({}))
                }]
            }
        );
        // Inclusive means only match fields in rhs against lhs (lhs can have more fields)
        let config = assert_json_diff::Config::new(assert_json_diff::CompareMode::Inclusive);

        match assert_json_diff::assert_json_matches_no_panic(
            &actual,
            &expected_with_message,
            config,
        ) {
            Ok(_) => assert!(true),
            Err(error) => {
                panic!(
                    "\n{}\n**actual**\n{}\n**expected**\n{}\n**query**\n{}",
                    error,
                    serde_json::to_string_pretty(&actual).unwrap(),
                    serde_json::to_string_pretty(&expected_with_message).unwrap(),
                    $query
                );
            }
        }
    }};
}

pub fn server_admin_context() -> (AuthenticationContext, MockData) {
    let user_id = "server_admin_user";

    let test_user_account = UserAccountRow {
        id: user_id.to_string(),
        ..UserAccountRow::default()
    };
    let test_user_permissions = UserPermissionRow {
        id: "user_permission_id".to_string(),
        user_id: user_id.to_string(),
        permission: Permission::ServerAdmin,
        ..UserPermissionRow::default()
    };

    let mock_permissions = MockData {
        user_accounts: vec![test_user_account],
        permissions: vec![test_user_permissions],
        ..MockData::default()
    };

    let authentication_context = AuthenticationContext {
        user_id: user_id.to_string(),
    };

    // Return context and mocks
    (authentication_context, mock_permissions)
}

pub async fn setup_graphql_test_with_data<
    Q: 'static + ObjectType + Clone,
    M: 'static + ObjectType + Clone,
>(
    queries: Q,
    mutations: M,
    db_name: &str,
    inserts: MockDataInserts,
    extra_mock_data: MockData,
    authentication_context: AuthenticationContext,
) -> (
    MockDataCollection,
    StorageConnection,
    StorageConnectionManager,
    TestGraphqlSettings<Q, M>,
) {
    let (mock_data, connection, connection_manager, _) =
        setup_all_with_data(db_name, inserts, extra_mock_data).await;

    (
        mock_data,
        connection,
        connection_manager.clone(),
        TestGraphqlSettings {
            queries,
            mutations,
            connection_manager,
            authentication_context,
        },
    )
}

pub async fn setup_graphql_test<
    Q: 'static + ObjectType + Clone,
    M: 'static + ObjectType + Clone,
>(
    queries: Q,
    mutations: M,
    db_name: &str,
    inserts: MockDataInserts,
) -> (
    MockDataCollection,
    StorageConnection,
    StorageConnectionManager,
    TestGraphqlSettings<Q, M>,
) {
    // This sets up a dummy admin user for testing.
    // If you want to test with a specific user, use setup_graphql_test_with_data
    let (authentication_context, mock_data) = server_admin_context();

    setup_graphql_test_with_data(
        queries,
        mutations,
        db_name,
        inserts,
        mock_data,
        authentication_context,
    )
    .await
}

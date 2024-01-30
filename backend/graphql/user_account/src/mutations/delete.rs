use async_graphql::*;
use graphql_core::{
    standard_graphql_error::{validate_auth, StandardGraphqlError},
    ContextExt,
};

use graphql_types::types::DeleteResponse;
use service::{
    auth::{Resource, ResourceAccessRequest},
    user_account::delete::DeleteUserAccountError as ServiceError,
};

pub fn delete_user_account(
    ctx: &Context<'_>,
    user_account_id: &str,
) -> Result<DeleteUserAccountResponse> {
    let user = validate_auth(
        ctx,
        &ResourceAccessRequest {
            resource: Resource::ServerAdmin,
        },
    )?;

    let service_context = ctx.service_context(Some(&user))?;

    match service_context
        .service_provider
        .user_account_service
        .delete_user_account(&service_context, user_account_id)
    {
        Ok(user_account_id) => Ok(DeleteUserAccountResponse::Response(DeleteResponse(
            user_account_id,
        ))),
        Err(error) => map_error(error),
    }
}

#[derive(Union)]
pub enum DeleteUserAccountResponse {
    Response(DeleteResponse),
}

fn map_error(error: ServiceError) -> Result<DeleteUserAccountResponse> {
    use StandardGraphqlError::*;
    let formatted_error = format!("{:#?}", error);

    let graphql_error = match error {
        // Structured Errors
        // Standard Graphql Errors
        ServiceError::UserAccountInUse(user_account_in_use) => {
            BadUserInput(user_account_in_use.description().to_string())
        }
        ServiceError::UserAccountDoesNotExist => BadUserInput(formatted_error),
        ServiceError::DatabaseError(_) => InternalError(formatted_error),
    };

    Err(graphql_error.extend())
}

#[cfg(test)]
mod test {
    use async_graphql::EmptyMutation;
    use graphql_core::{
        assert_graphql_query, assert_standard_graphql_error, test_helpers::setup_graphql_test,
    };
    use repository::{mock::MockDataInserts, StorageConnectionManager};
    use serde_json::json;

    use service::{
        service_provider::{ServiceContext, ServiceProvider},
        test_utils::get_test_settings,
        user_account::{delete::DeleteUserAccountError, UserAccountServiceTrait},
    };

    use crate::UserAccountMutations;

    type DeleteUserAccountMethod =
        dyn Fn(&str) -> Result<String, DeleteUserAccountError> + Sync + Send;

    pub struct TestService(pub Box<DeleteUserAccountMethod>);

    impl UserAccountServiceTrait for TestService {
        fn delete_user_account(
            &self,
            _: &ServiceContext,
            user_account_id: &str,
        ) -> Result<String, DeleteUserAccountError> {
            (self.0)(user_account_id)
        }
    }

    pub fn service_provider(
        user_account_service: TestService,
        connection_manager: &StorageConnectionManager,
    ) -> ServiceProvider {
        let mut service_provider =
            ServiceProvider::new(connection_manager.clone(), get_test_settings(""));
        service_provider.user_account_service = Box::new(user_account_service);
        service_provider
    }

    #[actix_rt::test]
    async fn test_graphql_delete_user_account_errors() {
        let (_, _, connection_manager, settings) = setup_graphql_test(
            EmptyMutation,
            UserAccountMutations,
            "test_graphql_delete_user_account_errors",
            MockDataInserts::none(),
        )
        .await;

        let mutation = r#"
        mutation ($input: String!) {
            deleteUserAccount(userAccountId: $input) {
            ... on DeleteResponse {
                id
                }
            }
          }
        "#;

        let variables = Some(json!({
          "input": "invalid_user_account_id"
        }));
        // Record Not Found
        let test_service = TestService(Box::new(|_| {
            Err(DeleteUserAccountError::UserAccountDoesNotExist)
        }));
        let expected_message = "Bad user input";

        assert_standard_graphql_error!(
            &settings,
            mutation,
            &variables,
            &expected_message,
            None,
            Some(service_provider(test_service, &connection_manager))
        );
    }

    #[actix_rt::test]
    async fn test_graphql_delete_user_account_success() {
        let (_, _, connection_manager, settings) = setup_graphql_test(
            EmptyMutation,
            UserAccountMutations,
            "test_graphql_delete_user_account_success",
            MockDataInserts::none(),
        )
        .await;

        let mutation = r#"
        mutation ($input: String!) {
            deleteUserAccount(userAccountId: $input) {
              ... on DeleteResponse {
                id
              }
            }
          }
        "#;

        let variables = Some(json!({
          "input": "user_account_id"
        }));

        let test_service = TestService(Box::new(|_| Ok("user_account_id".to_owned())));

        let expected = json!({
            "deleteUserAccount": {
                "id": "user_account_id",
            }
          }
        );

        assert_graphql_query!(
            &settings,
            mutation,
            &variables,
            &expected,
            Some(service_provider(test_service, &connection_manager))
        );
    }
}

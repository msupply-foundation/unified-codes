use async_graphql::*;
use graphql_core::{
    standard_graphql_error::{validate_auth, StandardGraphqlError},
    ContextExt,
};
use graphql_types::types::{PermissionNode, UserAccountNode};
use service::{
    auth::{Resource, ResourceAccessRequest},
    user_account::{create::CreateUserAccount, ModifyUserAccountError},
};

pub fn create_user_account(
    ctx: &Context<'_>,
    input: CreateUserAccountInput,
) -> Result<CreateUserAccountResponse> {
    let user = validate_auth(
        ctx,
        &ResourceAccessRequest {
            resource: Resource::MutateUsers,
        },
    )?;

    let service_context = ctx.service_context(Some(&user))?;

    match service_context
        .service_provider
        .user_account_service
        .create_user_account(&service_context, input.into())
    {
        Ok(user_account) => Ok(CreateUserAccountResponse::Response(
            UserAccountNode::from_domain(user_account),
        )),
        Err(error) => map_error(error),
    }
}

#[derive(InputObject, Clone)]
pub struct CreateUserAccountInput {
    pub id: String,
    pub username: String,
    pub password: String,
    pub email: Option<String>,
    pub display_name: Option<String>,
    pub permissions: Vec<PermissionNode>,
}

impl From<CreateUserAccountInput> for CreateUserAccount {
    fn from(
        CreateUserAccountInput {
            id,
            username,
            password,
            email,
            display_name,
            permissions,
        }: CreateUserAccountInput,
    ) -> Self {
        CreateUserAccount {
            id,
            username,
            password,
            email,
            display_name,
            permissions: permissions
                .into_iter()
                .map(PermissionNode::to_domain)
                .collect(),
        }
    }
}

#[derive(Union)]
pub enum CreateUserAccountResponse {
    Response(UserAccountNode),
}

fn map_error(error: ModifyUserAccountError) -> Result<CreateUserAccountResponse> {
    use StandardGraphqlError::*;
    let formatted_error = format!("{:#?}", error);

    let graphql_error = match error {
        // Standard Graphql Errors
        ModifyUserAccountError::UserAccountAlreadyExists => BadUserInput(formatted_error),
        ModifyUserAccountError::EmailAddressAlreadyExists => BadUserInput(formatted_error),
        ModifyUserAccountError::UserAccountDoesNotExist => BadUserInput(formatted_error),
        ModifyUserAccountError::InvalidPassword => BadUserInput(
            "Please ensure your password meets the minimum complexity standards".to_string(),
        ),
        ModifyUserAccountError::InvalidUsername => BadUserInput(
            "Invalid Username, username can only include english letters and numbers".to_string(),
        ),
        ModifyUserAccountError::PermissionsMissing => {
            BadUserInput("User must have a role or permission assigned".to_string())
        }
        ModifyUserAccountError::DatabaseError(_) => InternalError(formatted_error),
        ModifyUserAccountError::ModifiedRecordNotFound => InternalError(formatted_error),
        ModifyUserAccountError::PasswordHashError => InternalError(formatted_error),
        ModifyUserAccountError::InvalidToken => BadUserInput(formatted_error),
        ModifyUserAccountError::TokenExpired => {
            BadUserInput("Token has expired, please request a new invite".to_string())
        }
        ModifyUserAccountError::GenericError(s) => InternalError(s),
    };

    Err(graphql_error.extend())
}

#[cfg(test)]
mod test {

    use async_graphql::EmptyMutation;
    use graphql_core::{
        assert_graphql_query, assert_standard_graphql_error, test_helpers::setup_graphql_test,
    };
    use repository::{
        mock::MockDataInserts, StorageConnectionManager, UserAccount, UserAccountRow,
    };
    use serde_json::json;

    use service::{
        service_provider::{ServiceContext, ServiceProvider},
        test_utils::get_test_settings,
        user_account::{
            create::CreateUserAccount, ModifyUserAccountError, UserAccountServiceTrait,
        },
    };

    use crate::UserAccountMutations;

    type CreateUserAccountMethod =
        dyn Fn(CreateUserAccount) -> Result<UserAccount, ModifyUserAccountError> + Sync + Send;

    pub struct TestService(pub Box<CreateUserAccountMethod>);

    impl UserAccountServiceTrait for TestService {
        fn create_user_account(
            &self,
            _: &ServiceContext,
            input: CreateUserAccount,
        ) -> Result<UserAccount, ModifyUserAccountError> {
            (self.0)(input)
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
    async fn test_graphql_create_user_account_errors() {
        let (_, _, connection_manager, settings) = setup_graphql_test(
            EmptyMutation,
            UserAccountMutations,
            "test_graphql_create_user_account_errors",
            MockDataInserts::none(),
        )
        .await;

        let mutation = r#"
        mutation ($input: CreateUserAccountInput!) {
            createUserAccount(input: $input) {
                ... on UserAccountNode {
                    id
                    username
                  }
            }
          }
        "#;

        let variables = Some(json!({
          "input": {
            "id": "robs_id",
            "username": "rob",
            "password": "RobsSuperSecurePassword",
            "permissions":[]
          }
        }));

        // Record Already Exists
        let test_service = TestService(Box::new(|_| {
            Err(ModifyUserAccountError::UserAccountAlreadyExists)
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

        // Created record does not exists (this shouldn't happen, but want to test internal error)
        let mutation = r#"
         mutation ($input: CreateUserAccountInput!) {
             createUserAccount(input: $input) {
                ... on UserAccountNode {
                    id
                    username
                }
             }
           }
         "#;

        let test_service = TestService(Box::new(|_| {
            Err(ModifyUserAccountError::ModifiedRecordNotFound)
        }));
        let expected_message = "Internal error";
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
    async fn test_graphql_create_user_account_success() {
        let (_, _, connection_manager, settings) = setup_graphql_test(
            EmptyMutation,
            UserAccountMutations,
            "test_graphql_create_user_account_success",
            MockDataInserts::none(),
        )
        .await;

        let mutation = r#"
        mutation ($input: CreateUserAccountInput!) {
            createUserAccount(input: $input) {
              ... on UserAccountNode {
                id
                username
              }
            }
          }
        "#;

        let variables = Some(json!({
          "input": {
            "id": "robs_id",
            "username": "rob",
            "password": "RobsSuperSecurePassword",
            "permissions":[]
          }
        }));

        let test_service = TestService(Box::new(|_| {
            Ok(UserAccountRow {
                id: "robs_id".to_string(),
                username: "rob".to_string(),
                hashed_password: "".to_string(),
                email: Some("rob@example.com".to_string()),
                display_name: "Robert Jones".to_string(),
                password_reset_token: None,
                password_reset_datetime: None,
            })
        }));

        let expected = json!({
            "createUserAccount": {
                "id": "robs_id",
                "username": "rob",
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

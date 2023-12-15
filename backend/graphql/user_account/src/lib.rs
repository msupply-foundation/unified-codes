mod mutations;
use self::mutations::*;
mod types;
use self::types::*;

use async_graphql::*;
use graphql_core::{
    pagination::PaginationInput,
    standard_graphql_error::{validate_auth, StandardGraphqlError},
    ContextExt,
};
use graphql_types::types::*;
use repository::{PaginationOption, UserAccountFilter};
use service::auth::{Resource, ResourceAccessRequest};

#[derive(Default, Clone)]
pub struct UserAccountQueries;

#[Object]
impl UserAccountQueries {
    /// Query "user_accounts" entries
    pub async fn user_accounts(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Pagination option (first and offset)")] page: Option<PaginationInput>,
        #[graphql(desc = "Filter option")] filter: Option<UserAccountFilterInput>,
        #[graphql(desc = "Sort options (only first sort input is evaluated for this endpoint)")]
        sort: Option<Vec<UserAccountSortInput>>,
    ) -> Result<UserAccountsResponse> {
        let user = validate_auth(
            ctx,
            &ResourceAccessRequest {
                resource: Resource::QueryUsers,
            },
        )?;

        let service_context = ctx.service_context(Some(&user))?;

        let user_accounts = service_context
            .service_provider
            .user_account_service
            .get_user_accounts(
                &service_context,
                page.map(PaginationOption::from),
                filter.map(UserAccountFilter::from),
                // Currently only one sort option is supported, use the first from the list.
                sort.and_then(|mut sort_list| sort_list.pop())
                    .map(|sort| sort.to_domain()),
            )
            .map_err(StandardGraphqlError::from_list_error)?;

        Ok(UserAccountsResponse::Response(
            UserAccountConnector::from_domain(user_accounts),
        ))
    }
}

#[derive(Default, Clone)]
pub struct UserAccountMutations;

#[Object]
impl UserAccountMutations {
    async fn create_user_account(
        &self,
        ctx: &Context<'_>,
        input: CreateUserAccountInput,
    ) -> Result<CreateUserAccountResponse> {
        create_user_account(ctx, input)
    }

    async fn update_user_account(
        &self,
        ctx: &Context<'_>,
        input: UpdateUserAccountInput,
    ) -> Result<UpdateUserAccountResponse> {
        update_user_account(ctx, input)
    }

    async fn delete_user_account(
        &self,
        ctx: &Context<'_>,
        user_account_id: String,
    ) -> Result<DeleteUserAccountResponse> {
        delete_user_account(ctx, &user_account_id)
    }

    /// Initiates the password reset flow for a user based on email address
    /// The user will receive an email with a link to reset their password
    pub async fn initiate_password_reset(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Email Address")] email: String,
    ) -> Result<PasswordResetResponse> {
        initiate_password_reset(ctx, &email)
    }

    /// Validates Password Reset Token
    pub async fn validate_password_reset_token(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Password Reset Token")] token: String,
    ) -> Result<PasswordResetResponse> {
        validate_password_reset_token(ctx, &token)
    }

    /// Resets the password for a user based on the password reset token
    pub async fn reset_password_using_token(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Password Reset Token")] token: String,
        #[graphql(desc = "New Password")] password: String,
    ) -> Result<PasswordResetResponse> {
        reset_password_using_token(ctx, &token, &password)
    }

    /// Invites a new user to the system
    pub async fn initiate_user_invite(
        &self,
        ctx: &Context<'_>,
        input: InviteUserInput,
    ) -> Result<InviteUserResponse> {
        initiate_user_invite(ctx, input)
    }

    /// Updates user account based on a token and their information (Response to initiate_user_invite)
    pub async fn accept_user_invite(
        &self,
        ctx: &Context<'_>,
        token: String,
        input: AcceptUserInviteInput,
    ) -> Result<InviteUserResponse> {
        accept_user_invite(ctx, &token, input)
    }
}

#[cfg(test)]
mod test {
    use async_graphql::EmptyMutation;
    use graphql_core::assert_graphql_query;
    use graphql_core::test_helpers::setup_graphql_test;
    use repository::{
        mock::MockDataInserts, StorageConnectionManager, UserAccount, UserAccountFilter,
        UserAccountSort, UserAccountSortField,
    };
    use repository::{PaginationOption, Sort, StringFilter};
    use serde_json::json;

    use service::test_utils::get_test_settings;
    use service::{
        service_provider::{ServiceContext, ServiceProvider},
        user_account::UserAccountServiceTrait,
        ListError, ListResult,
    };

    use crate::UserAccountQueries;

    type GetUserAccounts = dyn Fn(
            Option<PaginationOption>,
            Option<UserAccountFilter>,
            Option<UserAccountSort>,
        ) -> Result<ListResult<UserAccount>, ListError>
        + Sync
        + Send;

    pub struct TestService(pub Box<GetUserAccounts>);

    impl UserAccountServiceTrait for TestService {
        fn get_user_accounts(
            &self,
            _ctx: &ServiceContext,
            pagination: Option<PaginationOption>,
            filter: Option<UserAccountFilter>,
            sort: Option<UserAccountSort>,
        ) -> Result<ListResult<UserAccount>, ListError> {
            (self.0)(pagination, filter, sort)
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
    async fn test_graphql_user_accounts_success() {
        let (_, _, connection_manager, settings) = setup_graphql_test(
            UserAccountQueries,
            EmptyMutation,
            "test_graphql_user_accounts_success",
            MockDataInserts::none().user_accounts(),
        )
        .await;

        let query = r#"
        query {
            userAccounts {
              ... on UserAccountConnector {
                nodes {
                  id
                  username
                  displayName
                }
                totalCount
              }
            }
        }
        "#;

        // Test single record
        let test_service = TestService(Box::new(|_, _, _| {
            Ok(ListResult {
                rows: vec![UserAccount {
                    id: "test_id".to_string(),
                    username: "test_username".to_string(),
                    hashed_password: "test_password".to_string(),
                    email: None,
                    display_name: "test_username".to_string(),
                    password_reset_token: None,
                    password_reset_datetime: None,
                }],
                count: 1,
            })
        }));

        let expected = json!({
              "userAccounts": {
                  "nodes": [
                      {
                          "id": "test_id",
                          "username": "test_username",
                          "displayName": "test_username",
                      },
                  ],
                  "totalCount": 1
              }
          }
        );

        assert_graphql_query!(
            &settings,
            query,
            &None,
            &expected,
            Some(service_provider(test_service, &connection_manager))
        );

        // Test no records

        let test_service = TestService(Box::new(|_, _, _| {
            Ok(ListResult {
                rows: Vec::new(),
                count: 0,
            })
        }));

        let expected = json!({
              "userAccounts": {
                  "nodes": [

                  ],
                  "totalCount": 0
              }
          }
        );

        assert_graphql_query!(
            &settings,
            query,
            &None,
            &expected,
            Some(service_provider(test_service, &connection_manager))
        );
    }

    #[actix_rt::test]
    async fn test_graphql_user_accounts_inputs() {
        let (_, _, connection_manager, settings) = setup_graphql_test(
            UserAccountQueries,
            EmptyMutation,
            "test_graphql_user_account_inputs",
            MockDataInserts::all(),
        )
        .await;

        let query = r#"
        query(
            $sort: [UserAccountSortInput]
            $filter: UserAccountFilterInput
          ) {
            userAccounts(sort: $sort, filter: $filter) {
              __typename
            }
          }

        "#;

        let expected = json!({
              "userAccounts": {
                  "__typename": "UserAccountConnector"
              }
          }
        );

        // Test sort by username no desc
        let test_service = TestService(Box::new(|_, _, sort| {
            assert_eq!(
                sort,
                Some(Sort {
                    key: UserAccountSortField::Username,
                    desc: None
                })
            );
            Ok(ListResult::empty())
        }));

        let variables = json!({
          "sort": [{
            "key": "username",
          }]
        });

        assert_graphql_query!(
            &settings,
            query,
            &Some(variables),
            &expected,
            Some(service_provider(test_service, &connection_manager))
        );

        // Test sort by username with desc
        let test_service = TestService(Box::new(|_, _, sort| {
            assert_eq!(
                sort,
                Some(Sort {
                    key: UserAccountSortField::Username,
                    desc: Some(true)
                })
            );
            Ok(ListResult::empty())
        }));

        let variables = json!({
          "sort": [{
            "key": "username",
            "desc": true
          }]
        });

        assert_graphql_query!(
            &settings,
            query,
            &Some(variables),
            &expected,
            Some(service_provider(test_service, &connection_manager))
        );

        // Test filter
        let test_service = TestService(Box::new(|_, filter, _| {
            assert_eq!(
                filter,
                Some(UserAccountFilter::new().username(StringFilter::equal_to("match_name")))
            );
            Ok(ListResult::empty())
        }));

        let variables = json!({
          "filter": {
            "username": { "equalTo": "match_name"},
          }
        });

        assert_graphql_query!(
            &settings,
            query,
            &Some(variables),
            &expected,
            Some(service_provider(test_service, &connection_manager))
        );
    }
}

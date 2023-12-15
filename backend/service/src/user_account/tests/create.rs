#[cfg(test)]
mod user_account_create_test {
    use repository::{mock::MockDataInserts, test_db::setup_all};
    use repository::{
        EqualFilter, Permission, UserAccountFilter, UserAccountRepository, UserPermissionFilter,
        UserPermissionRepository,
    };
    use std::sync::Arc;
    use util::uuid::uuid;

    use crate::service_provider::ServiceContext;
    use crate::user_account::ModifyUserAccountError;
    use crate::{service_provider::ServiceProvider, user_account::create::CreateUserAccount};

    use crate::test_utils::get_test_settings;
    #[actix_rt::test]
    async fn create_user_account_service_errors() {
        let (mock_data, _, connection_manager, _) =
            setup_all("create_user_account_service_errors", MockDataInserts::all()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::new(service_provider).unwrap();
        let service = &context.service_provider.user_account_service;

        //Create for a user_id that already exists (Should use update in this case)
        assert_eq!(
            service.create_user_account(
                &context,
                CreateUserAccount {
                    id: mock_data["base"].user_accounts[0].id.clone(),
                    username: mock_data["base"].user_accounts[0].username.clone(),
                    password: "".to_string(),
                    email: mock_data["base"].user_accounts[0].email.clone(),
                    display_name: Some(mock_data["base"].user_accounts[0].display_name.clone()),
                    permissions: vec![Permission::ServerAdmin]
                },
            ),
            Err(ModifyUserAccountError::UserAccountAlreadyExists)
        );

        //Create for a username that already exists
        assert_eq!(
            service.create_user_account(
                &context,
                CreateUserAccount {
                    id: "new_id".to_string(),
                    username: mock_data["base"].user_accounts[0].username.clone(),
                    password: "".to_string(),
                    email: mock_data["base"].user_accounts[0].email.clone(),
                    display_name: Some(mock_data["base"].user_accounts[0].display_name.clone()),
                    permissions: vec![Permission::ServerAdmin]
                },
            ),
            Err(ModifyUserAccountError::UserAccountAlreadyExists)
        );

        //Create for a username that already exists but we're trying to create the uppercase version
        assert_eq!(
            service.create_user_account(
                &context,
                CreateUserAccount {
                    id: "new_id".to_string(),
                    username: mock_data["base"].user_accounts[0]
                        .username
                        .clone()
                        .to_uppercase(),
                    password: "".to_string(),
                    email: mock_data["base"].user_accounts[0].email.clone(),
                    display_name: Some(mock_data["base"].user_accounts[0].display_name.clone()),
                    permissions: vec![Permission::Reader]
                },
            ),
            Err(ModifyUserAccountError::UserAccountAlreadyExists)
        );

        //Create with an empty password should fail
        assert_eq!(
            service.create_user_account(
                &context,
                CreateUserAccount {
                    id: "new_id".to_string(),
                    username: "new_id".to_string(),
                    password: "".to_string(),
                    email: mock_data["base"].user_accounts[0].email.clone(),
                    display_name: Some(mock_data["base"].user_accounts[0].display_name.clone()),
                    permissions: vec![Permission::ServerAdmin]
                },
            ),
            Err(ModifyUserAccountError::InvalidPassword)
        );

        //Create with an invalid username should fail
        assert_eq!(
            service.create_user_account(
                &context,
                CreateUserAccount {
                    id: "new_id".to_string(),
                    username: "Insert\"; Your SQL Injection Attack Here".to_string(),
                    password: "".to_string(),
                    email: mock_data["base"].user_accounts[0].email.clone(),
                    display_name: Some(mock_data["base"].user_accounts[0].display_name.clone()),
                    permissions: vec![Permission::Reader]
                },
            ),
            Err(ModifyUserAccountError::InvalidUsername)
        );
    }

    #[actix_rt::test]
    async fn create_user_account_service_success() {
        let (_, _, connection_manager, _) = setup_all(
            "create_user_account_service_success",
            MockDataInserts::all(),
        )
        .await;

        let connection = connection_manager.connection().unwrap();
        let user_account_repository = UserAccountRepository::new(&connection);
        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider).unwrap();
        let service = &context.service_provider.user_account_service;

        let new_user_id = uuid();
        let new_password = "%A_Nice_Long_Secure_PA55W0RD!".to_string();
        let result = service.create_user_account(
            &context,
            CreateUserAccount {
                id: new_user_id.clone(),
                username: "new_username".to_string(),
                password: new_password.clone(),
                email: None,
                display_name: None,
                permissions: vec![Permission::Reader],
            },
        );

        if !result.is_ok() {
            println!("Error: {:?}", result);
        }
        assert!(result.is_ok());

        let result = user_account_repository
            .query_by_filter(UserAccountFilter::new().id(EqualFilter::equal_to(&new_user_id)))
            .unwrap();

        //Ensure user can be queries again, and there's only 1 with that id
        assert!(result.len() == 1);

        //Check that the password has been hashed
        assert!(result[0].hashed_password != "");

        //Check Username gets lowercased

        let result = service.create_user_account(
            &context,
            CreateUserAccount {
                id: "new_id2".to_string(),
                username: "New_username2".to_string(),
                password: "%A_Nice_Long_Secure_PA55W0RD!".to_string(),
                email: None,
                display_name: None,
                permissions: vec![Permission::Reader],
            },
        );
        assert!(result.is_ok());

        let result = user_account_repository
            .query_by_filter(UserAccountFilter::new().id(EqualFilter::equal_to("new_id2")))
            .unwrap();

        //Ensure user can be queries again, and there's only 1 with that id
        assert!(result.len() == 1);

        //Check that the username is now lowercase
        assert!(result[0].username == "new_username2");
        assert!(result[0].hashed_password != new_password);
    }

    #[actix_rt::test]
    async fn create_user_account_with_permissions_success() {
        let (_, _, connection_manager, _) = setup_all(
            "create_user_account_with_permissions_success",
            MockDataInserts::all(),
        )
        .await;

        let connection = connection_manager.connection().unwrap();
        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider).unwrap();
        let service = &context.service_provider.user_account_service;
        let permission_repo = UserPermissionRepository::new(&connection);

        let new_user_id = uuid();
        let new_password = "%A_Nice_Long_Secure_PA55W0RD!".to_string();
        let result = service.create_user_account(
            &context,
            CreateUserAccount {
                id: new_user_id.clone(),
                username: "new_username".to_string(),
                password: new_password.clone(),
                email: None,
                display_name: None,
                permissions: vec![Permission::ServerAdmin],
            },
        );

        assert!(result.is_ok());

        //Check user was created and password hashed
        let result = service
            .get_user_account(&context, new_user_id.clone())
            .unwrap();
        assert!(result.hashed_password != new_password);

        //Check that the Permission has been assigned
        let result = permission_repo
            .query_by_filter(
                UserPermissionFilter::new().user_id(EqualFilter::equal_to(&new_user_id)),
            )
            .unwrap();

        assert!(result.len() == 1);
        assert!(result[0].permission == Permission::ServerAdmin);
    }
}

#[cfg(test)]
mod user_account_update_tests {

    use std::sync::Arc;

    use repository::{mock::MockDataInserts, test_db::setup_all};
    use repository::{EqualFilter, Permission, UserPermissionFilter, UserPermissionRepository};

    use crate::service_provider::ServiceContext;
    use crate::test_utils::get_test_settings;
    use crate::user_account::create::CreateUserAccount;
    use crate::user_account::ModifyUserAccountError;
    use crate::{service_provider::ServiceProvider, user_account::update::UpdateUserAccount};

    #[actix_rt::test]
    async fn user_account_service_update_errors() {
        let (_, _, connection_manager, _) = setup_all(
            "user_account_service_update_errors",
            MockDataInserts::none().user_accounts(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::new(service_provider).unwrap();
        let service = &context.service_provider.user_account_service;

        // Trying to updating UserAccount that does not exist should fail
        assert_eq!(
            service.update_user_account(
                &context,
                UpdateUserAccount {
                    id: "new_id".to_string(),
                    username: Some("new_username".to_string()),
                    password: Some("".to_string()),
                    email: None,
                    display_name: None,
                    permissions: None,
                },
            ),
            Err(ModifyUserAccountError::UserAccountDoesNotExist)
        );

        //Updating a username to an existing username should fail (Relies on mocks)
        assert_eq!(
            service.update_user_account(
                &context,
                UpdateUserAccount {
                    id: "id_user_account_a".to_string(),
                    username: Some("username_b".to_string()),
                    password: None,
                    email: None,
                    display_name: None,
                    permissions: None,
                },
            ),
            Err(ModifyUserAccountError::UserAccountAlreadyExists)
        );

        //Updating a username to an existing username should fail, even if case is different (Relies on mocks)
        assert_eq!(
            service.update_user_account(
                &context,
                UpdateUserAccount {
                    id: "id_user_account_a".to_string(),
                    username: Some("USERname_b".to_string()),
                    password: None,
                    email: None,
                    display_name: None,
                    permissions: None,
                },
            ),
            Err(ModifyUserAccountError::UserAccountAlreadyExists)
        );

        //Updating a password to empty string should fail
        assert_eq!(
            service.update_user_account(
                &context,
                UpdateUserAccount {
                    id: "id_user_account_a".to_string(),
                    username: None,
                    password: Some("".to_string()),
                    email: None,
                    display_name: None,
                    permissions: None,
                },
            ),
            Err(ModifyUserAccountError::InvalidPassword)
        );
    }
    #[actix_rt::test]
    async fn user_account_service_update_success() {
        let (_, _, connection_manager, _) = setup_all(
            "user_account_service_update_success",
            MockDataInserts::none().user_accounts().permissions(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider).unwrap();
        let permission_repo = UserPermissionRepository::new(&context.connection);

        //Create an user_account to update
        context
            .service_provider
            .user_account_service
            .create_user_account(
                &context,
                CreateUserAccount {
                    id: "id1".to_string(),
                    username: "id1_username".to_string(),
                    password: "C0mplexPassword".to_string(),
                    email: None,
                    display_name: None,
                    permissions: vec![Permission::ServerAdmin],
                },
            )
            .unwrap();

        // Update display name
        let updated_user_account = context
            .service_provider
            .user_account_service
            .update_user_account(
                &context,
                UpdateUserAccount {
                    id: "id1".to_string(),
                    username: Some("username_for_id1".to_string()),
                    password: None,
                    email: None,
                    display_name: Some("name_for_id1".to_string()),
                    permissions: None,
                },
            )
            .unwrap();

        assert_eq!(
            updated_user_account.display_name,
            "name_for_id1".to_string()
        );

        // Update email
        let updated_user_account = context
            .service_provider
            .user_account_service
            .update_user_account(
                &context,
                UpdateUserAccount {
                    id: "id1".to_string(),
                    username: None,
                    password: None,
                    email: Some("id1@example.com".to_string()),
                    display_name: None,
                    permissions: None,
                },
            )
            .unwrap();

        assert_eq!(
            updated_user_account.email,
            Some("id1@example.com".to_string())
        );

        let old_pasword_hash = updated_user_account.hashed_password;
        // Update password
        let updated_user_account = &context
            .service_provider
            .user_account_service
            .update_user_account(
                &context,
                UpdateUserAccount {
                    id: "id1".to_string(),
                    username: None,
                    password: Some("NewPassword".to_string()),
                    email: None,
                    display_name: None,
                    permissions: None,
                },
            )
            .unwrap();

        //Make sure password was updated
        assert!(old_pasword_hash != updated_user_account.hashed_password);
        assert!("NewPassword" != updated_user_account.hashed_password);

        //Add Permission (None currently)
        let _updated_user_account = context
            .service_provider
            .user_account_service
            .update_user_account(
                &context,
                UpdateUserAccount {
                    id: "id1".to_string(),
                    username: None,
                    password: None,
                    email: None,
                    display_name: None,
                    permissions: Some(vec![Permission::ServerAdmin]),
                },
            )
            .unwrap();

        //Check that the Permission has been assigned
        let result = permission_repo
            .query_by_filter(UserPermissionFilter::new().user_id(EqualFilter::equal_to("id1")))
            .unwrap();

        assert!(result.len() == 1);
        assert!(result[0].permission == Permission::ServerAdmin);

        //Add Same Permission again
        let _updated_user_account = context
            .service_provider
            .user_account_service
            .update_user_account(
                &context,
                UpdateUserAccount {
                    id: "id1".to_string(),
                    username: None,
                    password: None,
                    email: None,
                    display_name: None,
                    permissions: Some(vec![Permission::ServerAdmin]),
                },
            )
            .unwrap();

        //Check that the Permission is still assigned (Note: Current implementation means that the UserPermission ID will changed (Delete and reinsert))
        let result = permission_repo
            .query_by_filter(UserPermissionFilter::new().user_id(EqualFilter::equal_to("id1")))
            .unwrap();

        assert!(result.len() == 1);
        assert!(result[0].permission == Permission::ServerAdmin);

        //Change to another Permission
        let _updated_user_account = context
            .service_provider
            .user_account_service
            .update_user_account(
                &context,
                UpdateUserAccount {
                    id: "id1".to_string(),
                    username: None,
                    password: None,
                    email: None,
                    display_name: None,
                    permissions: Some(vec![Permission::Reader]),
                },
            )
            .unwrap();

        //Check that the new Permission is assigned and old one removed
        let result = permission_repo
            .query_by_filter(UserPermissionFilter::new().user_id(EqualFilter::equal_to("id1")))
            .unwrap();

        assert!(result.len() == 1);
        assert!(result[0].permission == Permission::Reader);

        //Add another Permission (one already there)
        let _updated_user_account = context
            .service_provider
            .user_account_service
            .update_user_account(
                &context,
                UpdateUserAccount {
                    id: "id1".to_string(),
                    username: None,
                    password: None,
                    email: None,
                    display_name: None,
                    permissions: Some(vec![Permission::Reader, Permission::ServerAdmin]),
                },
            )
            .unwrap();

        //Check that the 2 permissions are assigned
        let result = permission_repo
            .query_by_filter(UserPermissionFilter::new().user_id(EqualFilter::equal_to("id1")))
            .unwrap();

        assert!(result.len() == 2);
        let assigned_perms: Vec<Permission> =
            result.into_iter().map(|row| row.permission).collect();
        assert!(assigned_perms.contains(&Permission::Reader));
        assert!(assigned_perms.contains(&Permission::ServerAdmin));

        //Update to have no permissions
        let _updated_user_account = context
            .service_provider
            .user_account_service
            .update_user_account(
                &context,
                UpdateUserAccount {
                    id: "id1".to_string(),
                    username: None,
                    password: None,
                    email: None,
                    display_name: None,
                    permissions: Some(vec![]),
                },
            )
            .unwrap();

        //Check that the no permissions are assigned
        let result = permission_repo
            .query_by_filter(UserPermissionFilter::new().user_id(EqualFilter::equal_to("id1")))
            .unwrap();

        assert!(result.is_empty());
    }
}

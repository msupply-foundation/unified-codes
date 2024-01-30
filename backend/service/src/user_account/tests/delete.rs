#[cfg(test)]
mod user_account_delete_test {
    use std::sync::Arc;

    use repository::{mock::MockDataInserts, test_db::setup_all, UserAccountFilter};
    use repository::{EqualFilter, UserAccountRepository};

    use crate::service_provider::ServiceContext;
    use crate::test_utils::get_test_settings;
    use crate::{service_provider::ServiceProvider, user_account::delete::DeleteUserAccountError};
    #[actix_rt::test]
    async fn user_account_service_delete_errors() {
        let (_, _, connection_manager, _) =
            setup_all("user_account_service_delete_errors", MockDataInserts::all()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::new(service_provider).unwrap();
        let service = &context.service_provider.user_account_service;

        // UserAccount does not exist
        assert_eq!(
            service.delete_user_account(&context, "invalid_id",),
            Err(DeleteUserAccountError::UserAccountDoesNotExist)
        );
    }
    #[actix_rt::test]
    async fn user_account_service_delete_success() {
        let (_, _, connection_manager, _) = setup_all(
            "user_account_service_delete_success",
            MockDataInserts::all(),
        )
        .await;

        let connection = connection_manager.connection().unwrap();
        let user_account_repository = UserAccountRepository::new(&connection);
        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::new(service_provider).unwrap();
        let service = &context.service_provider.user_account_service;

        assert_eq!(
            service.delete_user_account(&context, "id_user_account_b"),
            Ok("id_user_account_b".to_string())
        );

        assert_eq!(
            user_account_repository
                .query_by_filter(
                    UserAccountFilter::new().id(EqualFilter::equal_to("id_user_account_b"))
                )
                .unwrap(),
            vec![]
        );
    }
}

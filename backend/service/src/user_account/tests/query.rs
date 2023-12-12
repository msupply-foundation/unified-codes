#[cfg(test)]
mod user_account_query_test {
    use std::sync::Arc;

    use repository::{
        mock::MockDataInserts, test_db::setup_all, UserAccountFilter, UserAccountSortField,
    };
    use repository::{EqualFilter, PaginationOption, Sort, StringFilter};

    use crate::service_provider::ServiceContext;
    use crate::test_utils::get_test_settings;
    use crate::{service_provider::ServiceProvider, ListError, SingleRecordError};

    #[actix_rt::test]
    async fn user_account_service_pagination() {
        let (_, _, connection_manager, _) = setup_all(
            "test_user_account_service_pagination",
            MockDataInserts::none().user_accounts(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::new(service_provider).unwrap();
        let service = &context.service_provider.user_account_service;

        assert_eq!(
            service.get_user_accounts(
                &context,
                Some(PaginationOption {
                    limit: Some(2000),
                    offset: None
                }),
                None,
                None,
            ),
            Err(ListError::LimitAboveMax(1000))
        );

        assert_eq!(
            service.get_user_accounts(
                &context,
                Some(PaginationOption {
                    limit: Some(0),
                    offset: None,
                }),
                None,
                None,
            ),
            Err(ListError::LimitBelowMin(1))
        );
    }

    #[actix_rt::test]
    async fn user_account_service_single_record() {
        let (_, _, connection_manager, _) = setup_all(
            "test_user_account_single_record",
            MockDataInserts::none().user_accounts(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::new(service_provider).unwrap();
        let service = &context.service_provider.user_account_service;

        assert_eq!(
            service.get_user_account(&context, "invalid_id".to_owned()),
            Err(SingleRecordError::NotFound("invalid_id".to_owned()))
        );

        let db_account = service
            .get_user_account(&context, "id_user_account_a".to_owned())
            .unwrap();

        assert_eq!(db_account.id, "id_user_account_a");
    }

    #[actix_rt::test]
    async fn user_account_service_filter() {
        let (_, _, connection_manager, _) = setup_all(
            "test_user_account_filter",
            MockDataInserts::none().user_accounts(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::new(service_provider).unwrap();
        let service = &context.service_provider.user_account_service;

        let db_accounts = service
            .get_user_accounts(
                &context,
                None,
                Some(UserAccountFilter::new().id(EqualFilter::equal_to("id_user_account_a"))),
                None,
            )
            .unwrap();

        assert_eq!(db_accounts.count, 1);
        assert_eq!(db_accounts.rows[0].id, "id_user_account_a");
    }

    #[actix_rt::test]
    async fn user_account_service_filter_search() {
        let (_, _, connection_manager, _) = setup_all(
            "test_user_account_filter_search",
            MockDataInserts::none().user_accounts(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::new(service_provider).unwrap();
        let service = &context.service_provider.user_account_service;

        let db_accounts = service
            .get_user_accounts(
                &context,
                None,
                Some(UserAccountFilter {
                    search: Some("x".to_string()),
                    ..Default::default()
                }),
                None,
            )
            .unwrap();

        assert_eq!(db_accounts.count, 2);
        assert_eq!(db_accounts.rows[0].username, "username_x");
        assert_eq!(
            db_accounts.rows[1].display_name,
            "user_account_x".to_string()
        );
    }

    #[actix_rt::test]
    async fn user_account_service_sort() {
        let (mock_data, _, connection_manager, _) = setup_all(
            "test_user_account_sort",
            MockDataInserts::none().user_accounts(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::new(service_provider).unwrap();
        let service = &context.service_provider.user_account_service;
        let remove_admin_filter =
            UserAccountFilter::new().username(StringFilter::not_equal_to("admin"));
        // Test Username sort with default sort order
        let db_accounts = service
            .get_user_accounts(
                &context,
                None,
                Some(remove_admin_filter.clone()),
                Some(Sort {
                    key: UserAccountSortField::Username,
                    desc: None,
                }),
            )
            .unwrap();

        let mut user_accounts = mock_data["base"].user_accounts.clone();
        user_accounts.sort_by(|a, b| a.username.to_lowercase().cmp(&b.username.to_lowercase()));

        let db_names: Vec<String> = db_accounts
            .rows
            .into_iter()
            .map(|user_account| user_account.username)
            .collect();
        let sorted_names: Vec<String> = user_accounts
            .into_iter()
            .map(|user_account| user_account.username)
            .collect();

        assert_eq!(db_names, sorted_names);

        // Test Name sort with desc sort
        let db_accounts = service
            .get_user_accounts(
                &context,
                None,
                Some(remove_admin_filter),
                Some(Sort {
                    key: repository::UserAccountSortField::Username,
                    desc: Some(true),
                }),
            )
            .unwrap();

        let mut user_accounts = mock_data["base"].user_accounts.clone();
        user_accounts.sort_by(|a, b| b.username.to_lowercase().cmp(&a.username.to_lowercase()));

        let result_names: Vec<String> = db_accounts
            .rows
            .into_iter()
            .map(|user_account| user_account.username)
            .collect();
        let sorted_names: Vec<String> = user_accounts
            .into_iter()
            .map(|user_account| user_account.username)
            .collect();

        assert_eq!(result_names, sorted_names);
    }
}

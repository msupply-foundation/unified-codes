#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod universal_codes_update_pending_change_body_test {
    use dgraph::ChangeType;
    use repository::{mock::MockDataInserts, test_db::setup_all};
    use std::sync::Arc;
    use util::uuid::uuid;

    use crate::service_provider::ServiceContext;

    use crate::service_provider::ServiceProvider;

    use crate::test_utils::get_test_settings;
    use crate::universal_codes::add_pending_change::AddPendingChange;

    #[actix_rt::test]
    async fn update_pending_change_body_success() {
        let (_, _, connection_manager, _) = setup_all(
            "update_pending_change_body_success",
            MockDataInserts::none(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.universal_codes_service;

        let request_id = uuid();
        let input = AddPendingChange {
            request_id: request_id.clone(),
            name: request_id.clone(),
            category: "test_category".to_string(),
            body: "test body".to_string(),
            change_type: ChangeType::New,
        };

        let result = service
            .add_pending_change(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();

        assert_eq!(result.body, "test body".to_string());

        let result = service
            .update_pending_change_body(
                service_provider.clone(),
                context.user_id.clone(),
                request_id.clone(),
                "new test body".to_string(),
            )
            .await
            .unwrap();

        assert_eq!(result.body, "new test body".to_string());

        // TODO: A better way to remove new pending change from dgraph
        // marking as rejected so as not to show up in PendingChange queries
        let _result = service
            .reject_pending_change(
                service_provider.clone(),
                context.user_id.clone(),
                request_id.clone(),
            )
            .await;
    }

    #[actix_rt::test]
    async fn update_pending_change_body_fail_if_body_is_empty() {
        let (_, _, connection_manager, _) = setup_all(
            "update_pending_change_body_fail_if_body_is_empty",
            MockDataInserts::none(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.universal_codes_service;

        let request_id = uuid();

        let result = service
            .update_pending_change_body(
                service_provider.clone(),
                context.user_id.clone(),
                request_id.clone(),
                "".to_string(),
            )
            .await;

        assert!(result.is_err());
    }

    #[actix_rt::test]
    async fn update_pending_change_body_fail_if_doesnt_exist() {
        let (_, _, connection_manager, _) = setup_all(
            "update_pending_change_body_fail_if_doesnt_exist",
            MockDataInserts::none(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.universal_codes_service;

        let request_id = uuid();

        let result = service
            .update_pending_change_body(
                service_provider.clone(),
                context.user_id.clone(),
                request_id.clone(),
                "new test body".to_string(),
            )
            .await;

        assert!(result.is_err());
    }

    #[actix_rt::test]
    async fn update_pending_change_body_fail_if_change_is_rejected() {
        let (_, _, connection_manager, _) = setup_all(
            "update_pending_change_body_fail_if_change_is_rejected",
            MockDataInserts::none(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.universal_codes_service;

        let request_id = uuid();
        let input = AddPendingChange {
            request_id: request_id.clone(),
            name: request_id.clone(),
            category: "test_category".to_string(),
            body: "test body".to_string(),
            change_type: ChangeType::New,
        };

        let result = service
            .add_pending_change(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();

        assert_eq!(result.body, "test body".to_string());

        let _result = service
            .reject_pending_change(
                service_provider.clone(),
                context.user_id.clone(),
                request_id.clone(),
            )
            .await;

        let result = service
            .update_pending_change_body(
                service_provider.clone(),
                context.user_id.clone(),
                request_id.clone(),
                "new test body".to_string(),
            )
            .await;

        assert!(result.is_err());

        // TODO: A better way to remove new pending change from dgraph
        // marking as rejected so as not to show up in PendingChange queries
        let _result = service
            .reject_pending_change(
                service_provider.clone(),
                context.user_id.clone(),
                request_id.clone(),
            )
            .await;
    }
}

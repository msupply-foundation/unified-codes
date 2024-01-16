#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod universal_codes_add_pending_change_test {
    use dgraph::ChangeType;
    use repository::{mock::MockDataInserts, test_db::setup_all};
    use std::sync::Arc;
    use util::uuid::uuid;

    use crate::service_provider::ServiceContext;

    use crate::service_provider::ServiceProvider;
    use crate::universal_codes::add_pending_change::AddPendingChange;

    use crate::test_utils::get_test_settings;

    #[actix_rt::test]
    async fn add_pending_change_success() {
        let (_, _, connection_manager, _) =
            setup_all("add_pending_change_success", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.universal_codes_service;

        let new_request_id = uuid();
        let input = AddPendingChange {
            request_id: new_request_id.clone(),
            name: new_request_id.clone(),
            category: "test_category".to_string(),
            body: "test body".to_string(),
            requested_for: "test country".to_string(),
            change_type: ChangeType::New,
        };

        let result = service
            .add_pending_change(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();

        assert_eq!(result.request_id, new_request_id);
        assert_eq!(result.name, new_request_id);

        // TODO: A better way to remove new pending change from dgraph
        // marking as rejected so as not to show up in PendingChange queries
        let _result = service
            .reject_pending_change(
                service_provider.clone(),
                context.user_id.clone(),
                new_request_id.clone(),
            )
            .await;
    }

    #[actix_rt::test]
    async fn add_pending_change_fails_with_empty_string() {
        let (_, _, connection_manager, _) = setup_all(
            "add_pending_change_fails_with_empty_string",
            MockDataInserts::none(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.universal_codes_service;

        let new_request_id = uuid();
        let input = AddPendingChange {
            request_id: new_request_id.clone(),
            name: new_request_id.clone(),
            category: "".to_string(),
            body: "test body".to_string(),
            requested_for: "test country".to_string(),
            change_type: ChangeType::New,
        };

        let result = service
            .add_pending_change(service_provider, context.user_id, input)
            .await;

        assert!(result.is_err());
    }
}

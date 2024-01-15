#[cfg(test)]
// #[cfg(feature = "dgraph-tests")]
mod universal_codes_reject_pending_change_test {
    use dgraph::ChangeStatus;
    use dgraph::ChangeType;
    use repository::{mock::MockDataInserts, test_db::setup_all};
    use std::sync::Arc;
    use util::uuid::uuid;

    use crate::service_provider::ServiceContext;

    use crate::service_provider::ServiceProvider;

    use crate::test_utils::get_test_settings;
    use crate::universal_codes::upsert_pending_change::UpsertPendingChange;

    #[actix_rt::test]
    async fn reject_pending_change_success() {
        let (_, _, connection_manager, _) =
            setup_all("reject_pending_change_success", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.universal_codes_service;

        let request_id = uuid();
        let input = UpsertPendingChange {
            request_id: request_id.clone(),
            name: request_id.clone(),
            category: "test_category".to_string(),
            body: "test body".to_string(),
            requested_for: "test country".to_string(),
            change_type: ChangeType::New,
        };

        let result = service
            .upsert_pending_change(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();

        assert_eq!(result.request_id, request_id);
        assert_eq!(result.status, ChangeStatus::Pending);

        let result = service
            .reject_pending_change(
                service_provider.clone(),
                context.user_id.clone(),
                request_id.clone(),
            )
            .await
            .unwrap();

        assert_eq!(result, request_id);

        let result = service.pending_change(request_id.clone()).await.unwrap();

        assert!(result.is_some());
        assert_eq!(result.unwrap().status, ChangeStatus::Rejected);

        // Cannot reject again...
        let result = service
            .reject_pending_change(
                service_provider.clone(),
                context.user_id.clone(),
                request_id.clone(),
            )
            .await;

        assert!(result.is_err());
    }
}

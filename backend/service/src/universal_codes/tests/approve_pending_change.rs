#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod universal_codes_approve_pending_change_test {
    use dgraph::ChangeStatus;
    use dgraph::ChangeType;
    use repository::{mock::MockDataInserts, test_db::setup_all};
    use std::sync::Arc;
    use util::uuid::uuid;

    use crate::service_provider::ServiceContext;

    use crate::service_provider::ServiceProvider;

    use crate::test_utils::get_test_settings;
    use crate::universal_codes::add_pending_change::AddPendingChange;
    use crate::universal_codes::upsert::UpsertUniversalCode;

    #[actix_rt::test]
    async fn approve_pending_change_fail_if_upsert_fails() {
        let (_, _, connection_manager, _) = setup_all(
            "approve_pending_change_fail_if_upsert_fails",
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
            body: "would be the upsert body below..".to_string(),
            change_type: ChangeType::New,
        };

        let result = service
            .add_pending_change(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();

        assert_eq!(result.request_id, request_id);
        assert_eq!(result.status, ChangeStatus::Pending);

        let new_code_id = uuid();
        let input = UpsertUniversalCode {
            code: Some(new_code_id.clone()),
            parent_code: None,
            name: Some("".to_string()), // empty name -> upsert will fail
            description: Some(new_code_id.clone()),
            r#type: Some("test_type".to_string()),
            category: Some("test_category".to_string()),
            alternative_names: None,
            properties: None,
            children: None,
        };

        let result = service
            .approve_pending_change(
                service_provider.clone(),
                context.user_id.clone(),
                request_id.clone(),
                input,
            )
            .await;

        // Upsert failed
        assert!(result.is_err());

        let result = service.pending_change(request_id.clone()).await.unwrap();

        assert!(result.is_some());
        assert_eq!(result.unwrap().status, ChangeStatus::Pending); // upsert failed, still pending

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
    async fn approve_pending_change_success() {
        let (_, _, connection_manager, _) =
            setup_all("approve_pending_change_success", MockDataInserts::none()).await;

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
            body: "would be the upsert body below..".to_string(),
            change_type: ChangeType::New,
        };

        let result = service
            .add_pending_change(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();

        assert_eq!(result.request_id, request_id);
        assert_eq!(result.status, ChangeStatus::Pending);

        let new_code_id = uuid();
        let input = UpsertUniversalCode {
            code: Some(new_code_id.clone()),
            parent_code: None,
            name: Some(new_code_id.clone()),
            description: Some(new_code_id.clone()),
            r#type: Some("test_type".to_string()),
            category: Some("test_category".to_string()),
            alternative_names: None,
            properties: None,
            children: None,
        };

        let result = service
            .approve_pending_change(
                service_provider.clone(),
                context.user_id.clone(),
                request_id.clone(),
                input.clone(),
            )
            .await;

        assert!(result.is_ok());

        let result = service.pending_change(request_id.clone()).await.unwrap();

        assert!(result.is_some());
        assert_eq!(result.unwrap().status, ChangeStatus::Approved);

        // Cannot approve again...
        let result = service
            .approve_pending_change(
                service_provider.clone(),
                context.user_id.clone(),
                request_id.clone(),
                input,
            )
            .await;

        assert!(result.is_err());
    }
}

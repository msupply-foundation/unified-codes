#[cfg(test)]
mod universal_codes_upsert_test {
    use repository::{mock::MockDataInserts, test_db::setup_all};
    use std::sync::Arc;
    use util::uuid::uuid;

    use crate::service_provider::ServiceContext;

    use crate::service_provider::ServiceProvider;
    use crate::universal_codes::upsert::UpsertUniversalCode;

    use crate::test_utils::get_test_settings;

    #[actix_rt::test]
    async fn upsert_entity_success() {
        let (_, _, connection_manager, _) =
            setup_all("upsert_entity_success", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.universal_codes_service;

        let new_code_id = uuid();
        let input = UpsertUniversalCode {
            code: Some(new_code_id.clone()),
            parent_code: None,
            name: Some(new_code_id.clone()),
            description: Some(new_code_id.clone()),
            r#type: Some("test_type".to_string()),
            category: Some("test_category".to_string()),
            properties: None,
            children: None,
        };

        let result = service
            .upsert_entity(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();

        // TODO: Check it saved correctly
        assert_eq!(result.code, new_code_id);
        assert_eq!(result.name, new_code_id);

        // Update the entity
        let input = UpsertUniversalCode {
            code: Some(new_code_id.clone()),
            parent_code: None,
            name: Some("I'm a test, please delete me!".to_string()),
            description: Some(new_code_id.clone()),
            r#type: Some("test_type".to_string()),
            category: Some("test_category".to_string()),
            properties: None,
            children: None,
        };

        let result = service
            .upsert_entity(service_provider, context.user_id, input)
            .await
            .unwrap();

        // TODO: Check it saved correctly
        assert_eq!(result.code, new_code_id);
        assert_eq!(result.name, "I'm a test, please delete me!");

        // TODO: Delete new code from dgraph
    }

    #[actix_rt::test]
    async fn upsert_entity_success_with_children() {
        let (_, _, connection_manager, _) = setup_all(
            "upsert_entity_success_with_children",
            MockDataInserts::none(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.universal_codes_service;

        let new_code_id = uuid();
        let input = UpsertUniversalCode {
            code: Some(new_code_id.clone()),
            parent_code: None,
            name: Some(new_code_id.clone()),
            description: Some(new_code_id.clone()),
            r#type: Some("test_type".to_string()),
            category: Some("test_category".to_string()),
            properties: None,
            children: Some(vec![
                UpsertUniversalCode {
                    code: Some(uuid()),
                    parent_code: None,
                    name: Some("child 1".to_string()),
                    description: Some("child 1".to_string()),
                    r#type: Some("test_type".to_string()),
                    category: Some("test_category".to_string()),
                    properties: None,
                    children: None,
                },
                UpsertUniversalCode {
                    code: Some(uuid()),
                    parent_code: None,
                    name: Some("child 2".to_string()),
                    description: Some("child 2".to_string()),
                    r#type: Some("test_type".to_string()),
                    category: Some("test_category".to_string()),
                    properties: None,
                    children: None,
                },
            ]),
        };

        let result = service
            .upsert_entity(service_provider, context.user_id, input)
            .await
            .unwrap();
        assert_eq!(result.children.len(), 2);
    }
}

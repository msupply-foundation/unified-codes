#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod test {
    use repository::{mock::MockDataInserts, test_db::setup_all};
    use std::sync::Arc;
    use util::uuid::uuid;

    use crate::configuration::upsert::AddConfigurationItem;
    use crate::service_provider::ServiceContext;
    use crate::service_provider::ServiceProvider;

    use crate::test_utils::get_test_settings;

    #[actix_rt::test]
    async fn add_configuration_item_success() {
        let (_, _, connection_manager, _) =
            setup_all("add_configuration_item_success", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.configuration_service;

        let new_code_id = uuid();
        let item_type = "test_type".to_string();
        let input = AddConfigurationItem {
            name: new_code_id.clone(),
            r#type: item_type,
        };

        let result = service
            .add_configuration_item(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();
        assert_eq!(result, 1);

        // Check that the item was added
        let items = service
            .configuration_items(crate::configuration::ConfigurationType::Test)
            .await
            .unwrap();

        let mut found = false;
        for item in items.data {
            if item.code == new_code_id {
                found = true;
                break;
            }
        }
        assert!(found);

        // Delete the newly created code
        let _result = service
            .delete_configuration_item(
                service_provider.clone(),
                context.user_id.clone(),
                new_code_id.clone(),
            )
            .await
            .unwrap();
    }
}

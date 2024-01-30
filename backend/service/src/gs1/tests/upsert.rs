#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod test {
    use repository::{mock::MockDataInserts, test_db::setup_all};
    use std::sync::Arc;
    use util::uuid::uuid;

    use crate::gs1::upsert::AddGS1;
    use crate::service_provider::ServiceContext;
    use crate::service_provider::ServiceProvider;

    use crate::test_utils::get_test_settings;

    #[actix_rt::test]
    async fn add_gs1_success() {
        let (_, _, connection_manager, _) =
            setup_all("add_gs1_success", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.gs1_service;

        let new_gtin = uuid();
        let input = AddGS1 {
            gtin: new_gtin.clone(),
            manufacturer: "test_manufacturer".to_string(),
            entity_code: "c7750265".to_string(),
        };

        let result = service
            .add_gs1(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();
        assert_eq!(result.gtin, new_gtin);

        // Delete the newly created gs1
        let _result = service
            .delete_gs1(
                service_provider.clone(),
                context.user_id.clone(),
                new_gtin.clone(),
            )
            .await
            .unwrap();
    }

    #[actix_rt::test]
    async fn add_gs1_no_gtin() {
        let (_, _, connection_manager, _) =
            setup_all("add_gs1_no_gtin", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.gs1_service;

        let input = AddGS1 {
            gtin: "".to_string(),
            manufacturer: "test_manufacturer".to_string(),
            entity_code: "c7750265".to_string(),
        };

        let result = service
            .add_gs1(service_provider.clone(), context.user_id.clone(), input)
            .await;
        assert!(result.is_err());
    }

    #[actix_rt::test]
    async fn add_gs1_gs1_already_exists() {
        let (_, _, connection_manager, _) =
            setup_all("add_gs1_gs1_already_exists", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.gs1_service;

        // Add new GS1
        let new_gtin = uuid();
        let input = AddGS1 {
            gtin: new_gtin.clone(),
            manufacturer: "test_manufacturer".to_string(),
            entity_code: "c7750265".to_string(),
        };

        let result = service
            .add_gs1(
                service_provider.clone(),
                context.user_id.clone(),
                input.clone(),
            )
            .await
            .unwrap();
        assert_eq!(result.gtin, new_gtin);

        // Try add another with same GTIN
        let input = AddGS1 {
            gtin: new_gtin.clone(),
            manufacturer: "another_manufacturer".to_string(),
            entity_code: "6d8482f7".to_string(),
        };
        let result = service
            .add_gs1(service_provider.clone(), context.user_id.clone(), input)
            .await;

        assert!(result.is_err());

        // Delete the newly created gs1
        let _result = service
            .delete_gs1(
                service_provider.clone(),
                context.user_id.clone(),
                new_gtin.clone(),
            )
            .await
            .unwrap();
    }

    #[actix_rt::test]
    async fn add_gs1_entity_code_not_found() {
        let (_, _, connection_manager, _) =
            setup_all("add_gs1_entity_code_not_found", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.gs1_service;

        let new_gtin = uuid();
        let input = AddGS1 {
            gtin: new_gtin.clone(),
            manufacturer: "test_manufacturer".to_string(),
            entity_code: "doesn't exist".to_string(),
        };

        let result = service
            .add_gs1(service_provider.clone(), context.user_id.clone(), input)
            .await;
        assert!(result.is_err());
    }
}

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
    async fn delete_gs1_success() {
        let (_, _, connection_manager, _) =
            setup_all("delete_gs1_success", MockDataInserts::none()).await;

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

        // Check the gs1 no longer exists
        let result = service.gs1_by_gtin(new_gtin.clone()).await.unwrap();
        assert!(result.is_none());
    }

    #[actix_rt::test]
    async fn delete_gs1_gtin_doesnt_exist() {
        let (_, _, connection_manager, _) =
            setup_all("delete_gs1_gtin_doesnt_exist", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.gs1_service;

        let some_gtin = uuid();

        // Try delete non-existent gs1
        let result = service
            .delete_gs1(
                service_provider.clone(),
                context.user_id.clone(),
                some_gtin.clone(),
            )
            .await;

        assert!(result.is_err());
    }
}

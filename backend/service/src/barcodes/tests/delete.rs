#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod test {
    use repository::{mock::MockDataInserts, test_db::setup_all};
    use std::sync::Arc;
    use util::uuid::uuid;

    use crate::barcodes::upsert::AddBarcode;
    use crate::service_provider::ServiceContext;
    use crate::service_provider::ServiceProvider;

    use crate::test_utils::get_test_settings;

    #[actix_rt::test]
    async fn delete_barcode_success() {
        let (_, _, connection_manager, _) =
            setup_all("delete_barcode_success", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.barcode_service;

        let new_gtin = uuid();
        let input = AddBarcode {
            gtin: new_gtin.clone(),
            manufacturer: "test_manufacturer".to_string(),
            entity_code: "c7750265".to_string(),
        };

        let result = service
            .add_barcode(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();
        assert_eq!(result.gtin, new_gtin);

        // Delete the newly created barcode
        let _result = service
            .delete_barcode(
                service_provider.clone(),
                context.user_id.clone(),
                new_gtin.clone(),
            )
            .await
            .unwrap();

        // Check the barcode no longer exists
        let result = service.barcode_by_gtin(new_gtin.clone()).await.unwrap();
        assert!(result.is_none());
    }

    #[actix_rt::test]
    async fn delete_barcode_gtin_doesnt_exist() {
        let (_, _, connection_manager, _) =
            setup_all("delete_barcode_gtin_doesnt_exist", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.barcode_service;

        let some_gtin = uuid();

        // Try delete non-existent barcode
        let result = service
            .delete_barcode(
                service_provider.clone(),
                context.user_id.clone(),
                some_gtin.clone(),
            )
            .await;

        assert!(result.is_err());
    }
}

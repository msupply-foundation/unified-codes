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
    async fn add_barcode_success() {
        let (_, _, connection_manager, _) =
            setup_all("add_barcode_success", MockDataInserts::none()).await;

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
    }

    #[actix_rt::test]
    async fn add_barcode_no_gtin() {
        let (_, _, connection_manager, _) =
            setup_all("add_barcode_no_gtin", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.barcode_service;

        let input = AddBarcode {
            gtin: "".to_string(),
            manufacturer: "test_manufacturer".to_string(),
            entity_code: "c7750265".to_string(),
        };

        let result = service
            .add_barcode(service_provider.clone(), context.user_id.clone(), input)
            .await;
        assert!(result.is_err());
    }

    #[actix_rt::test]
    async fn add_barcode_already_exists() {
        let (_, _, connection_manager, _) =
            setup_all("add_barcode_already_exists", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.barcode_service;

        // Add new barcode
        let new_gtin = uuid();
        let input = AddBarcode {
            gtin: new_gtin.clone(),
            manufacturer: "test_manufacturer".to_string(),
            entity_code: "c7750265".to_string(),
        };

        let result = service
            .add_barcode(
                service_provider.clone(),
                context.user_id.clone(),
                input.clone(),
            )
            .await
            .unwrap();
        assert_eq!(result.gtin, new_gtin);

        // Try add another with same GTIN
        let input = AddBarcode {
            gtin: new_gtin.clone(),
            manufacturer: "another_manufacturer".to_string(),
            entity_code: "6d8482f7".to_string(),
        };
        let result = service
            .add_barcode(service_provider.clone(), context.user_id.clone(), input)
            .await;

        assert!(result.is_err());

        // Delete the newly created barcode
        let _result = service
            .delete_barcode(
                service_provider.clone(),
                context.user_id.clone(),
                new_gtin.clone(),
            )
            .await
            .unwrap();
    }

    #[actix_rt::test]
    async fn add_barcode_entity_code_not_found() {
        let (_, _, connection_manager, _) =
            setup_all("add_barcode_entity_code_not_found", MockDataInserts::none()).await;

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
            entity_code: "doesn't exist".to_string(),
        };

        let result = service
            .add_barcode(service_provider.clone(), context.user_id.clone(), input)
            .await;
        assert!(result.is_err());
    }
}

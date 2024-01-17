#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod universal_codes_product_by_code_test {
    // Product by code should return the product with the code supplied, or the product with the code underneath it in the tree
    /*
    Here's our example entity tree
    {
        "entity": {
            "code": "f7e4e646",
            "name": "Amiodarone",
            "type": "drug",
            "children": [
                {
                    "code": "88abe800",
                    "name": "Parenteral",
                    "type": "Route",
                    "children": [
                        {
                            "code": "1b3b0b00",
                            "name": "Solution",
                            "type": "Form",
                            "children": [
                                {
                                    "code": "0ce01b00",
                                    "name": "50mg per mL",
                                    "type": "DoseStrength",
                                    "children": [
                                        {
                                            "code": "360a24bf",
                                            "name": "3mL",
                                            "type": "Unit",
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
        */

    use crate::service_provider::ServiceProvider;
    use crate::test_utils::get_test_settings;
    use repository::{mock::MockDataInserts, test_db::setup_all};
    use std::sync::Arc;

    // Check it works when the code is the product code
    #[actix_rt::test]
    async fn product_by_product_code() {
        let (_, _, connection_manager, _) =
            setup_all("product_by_product_code", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));

        let code = "f7e4e646".to_string();
        let result = service_provider
            .universal_codes_service
            .product_by_code(code.clone())
            .await
            .unwrap();

        let product = result.unwrap();
        assert_eq!(product.code, code);
        assert_eq!(product.name, "Amiodarone".to_string());
        assert_eq!(product.r#type, "Product".to_string());
    }

    // Check it works when the code is the route code
    #[actix_rt::test]
    async fn product_by_route_code() {
        let (_, _, connection_manager, _) =
            setup_all("product_by_route_code", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));

        let code = "88abe800".to_string();
        let result = service_provider
            .universal_codes_service
            .product_by_code(code.clone())
            .await
            .unwrap();

        let product = result.unwrap();
        assert_eq!(product.code, "f7e4e646".to_string());
        assert_eq!(product.name, "Amiodarone".to_string());
        assert_eq!(product.r#type, "Product".to_string());
    }

    // Check it works when the code is the form code
    #[actix_rt::test]
    async fn product_by_form_code() {
        let (_, _, connection_manager, _) =
            setup_all("product_by_form_code", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));

        let code = "1b3b0b00".to_string();
        let result = service_provider
            .universal_codes_service
            .product_by_code(code.clone())
            .await
            .unwrap();

        let product = result.unwrap();
        assert_eq!(product.code, "f7e4e646".to_string());
        assert_eq!(product.name, "Amiodarone".to_string());
        assert_eq!(product.r#type, "Product".to_string());
    }

    // Check it works when the code is the dose strength code
    #[actix_rt::test]
    async fn product_by_dose_strength_code() {
        let (_, _, connection_manager, _) =
            setup_all("product_by_dose_strength_code", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));

        let code = "0ce01b00".to_string();
        let result = service_provider
            .universal_codes_service
            .product_by_code(code.clone())
            .await
            .unwrap();

        let product = result.unwrap();
        assert_eq!(product.code, "f7e4e646".to_string());
        assert_eq!(product.name, "Amiodarone".to_string());
        assert_eq!(product.r#type, "Product".to_string());
    }

    // Check it works when the code is the unit code
    #[actix_rt::test]
    async fn product_by_unit_code() {
        let (_, _, connection_manager, _) =
            setup_all("product_by_unit_code", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));

        let code = "360a24bf".to_string();
        let result = service_provider
            .universal_codes_service
            .product_by_code(code.clone())
            .await
            .unwrap();

        let product = result.unwrap();
        assert_eq!(product.code, "f7e4e646".to_string());
        assert_eq!(product.name, "Amiodarone".to_string());
        assert_eq!(product.r#type, "Product".to_string());
    }
}

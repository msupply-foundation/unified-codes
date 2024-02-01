#[cfg(test)]
// #[cfg(feature = "dgraph-tests")]
mod test {
    use repository::{mock::MockDataInserts, test_db::setup_all};
    use std::sync::Arc;
    use util::uuid::uuid;

    use crate::drug_interactions::upsert_group::UpsertDrugInteractionGroup;
    use crate::drug_interactions::upsert_interaction::UpsertDrugInteraction;
    use crate::service_provider::ServiceContext;
    use crate::service_provider::ServiceProvider;

    use crate::test_utils::get_test_settings;

    #[actix_rt::test]
    async fn add_drug_interaction_drug_drug_success() {
        let (_, _, connection_manager, _) = setup_all(
            "add_drug_interaction_drug_drug_success",
            MockDataInserts::none(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.drug_interaction_service;

        let new_interaction_id = uuid();

        let input = UpsertDrugInteraction {
            interaction_id: new_interaction_id.clone(),
            name: new_interaction_id.clone(),
            description: "This is just a test".to_string(),
            severity: dgraph::DrugInteractionSeverity::NothingExpected,
            action: String::new(),
            reference: String::new(),
            drug_code_1: Some("c9896104".to_string()),
            drug_code_2: Some("49e96100".to_string()),
            interaction_group_id_1: None,
            interaction_group_id_2: None,
        };

        let result = service
            .upsert_drug_interaction(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();
        assert_eq!(result, 1);

        // Check that the item was added
        let items = service.all_drug_interactions().await.unwrap();

        let mut found = false;
        for item in items.data {
            if item.interaction_id == new_interaction_id {
                assert_eq!(item.drugs.len(), 2);
                assert!(item.groups.is_empty());
                found = true;
                break;
            }
        }
        assert!(found);

        // Delete the newly created code
        let _result = service
            .delete_drug_interaction_group(service_provider, context.user_id, new_interaction_id)
            .await
            .unwrap();
    }

    #[actix_rt::test]
    async fn add_drug_interaction_group_drug_success() {
        let (_, _, connection_manager, _) = setup_all(
            "add_drug_interaction_group_drug_success",
            MockDataInserts::none(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.drug_interaction_service;

        let new_interaction_group_id = uuid();
        let group_name = uuid();
        let input = UpsertDrugInteractionGroup {
            interaction_group_id: new_interaction_group_id.clone(),
            name: group_name.clone(),
            description: Some("Description".to_string()),
            drugs: vec!["c9896104".to_string()],
        };

        let result = service
            .upsert_drug_interaction_group(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();
        assert_eq!(result, 1);

        let new_interaction_id = uuid();

        let input = UpsertDrugInteraction {
            interaction_id: new_interaction_id.clone(),
            name: new_interaction_id.clone(),
            description: "This is just a test".to_string(),
            severity: dgraph::DrugInteractionSeverity::NothingExpected,
            action: String::new(),
            reference: String::new(),
            drug_code_1: None,
            drug_code_2: Some("49e96100".to_string()),
            interaction_group_id_1: Some(new_interaction_group_id.clone()),
            interaction_group_id_2: None,
        };

        let result = service
            .upsert_drug_interaction(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();
        assert_eq!(result, 1);

        // Check that the item was added
        let items = service.all_drug_interactions().await.unwrap();

        let mut found = false;
        for item in items.data {
            if item.interaction_id == new_interaction_id {
                assert_eq!(item.drugs.len(), 1);
                assert_eq!(item.groups.len(), 1);
                found = true;
                break;
            }
        }
        assert!(found);
        // Delete the newly created interaction
        let _result = service
            .delete_drug_interaction_group(
                service_provider.clone(),
                context.user_id.clone(),
                new_interaction_id.clone(),
            )
            .await
            .unwrap();

        // Delete the newly created group
        let _result = service
            .delete_drug_interaction_group(
                service_provider.clone(),
                context.user_id.clone(),
                new_interaction_group_id.clone(),
            )
            .await
            .unwrap();
    }

    #[actix_rt::test]
    async fn add_drug_interaction_group_group_success() {
        let (_, _, connection_manager, _) = setup_all(
            "add_drug_interaction_group_group_success",
            MockDataInserts::none(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.drug_interaction_service;

        let new_interaction_group_id_1 = uuid();
        let group_name = uuid();
        let input = UpsertDrugInteractionGroup {
            interaction_group_id: new_interaction_group_id_1.clone(),
            name: group_name.clone(),
            description: Some("Description".to_string()),
            drugs: vec!["c9896104".to_string()],
        };

        let result = service
            .upsert_drug_interaction_group(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();
        assert_eq!(result, 1);

        let new_interaction_group_id_2 = uuid();
        let group_name = uuid();
        let input = UpsertDrugInteractionGroup {
            interaction_group_id: new_interaction_group_id_2.clone(),
            name: group_name.clone(),
            description: Some("Description".to_string()),
            drugs: vec!["c9896104".to_string()],
        };

        let result = service
            .upsert_drug_interaction_group(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();
        assert_eq!(result, 1);

        let new_interaction_id = uuid();

        let input = UpsertDrugInteraction {
            interaction_id: new_interaction_id.clone(),
            name: new_interaction_id.clone(),
            description: "This is just a test".to_string(),
            severity: dgraph::DrugInteractionSeverity::NothingExpected,
            action: String::new(),
            reference: String::new(),
            drug_code_1: None,
            drug_code_2: None,
            interaction_group_id_1: Some(new_interaction_group_id_1.clone()),
            interaction_group_id_2: Some(new_interaction_group_id_2.clone()),
        };

        let result = service
            .upsert_drug_interaction(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();
        assert_eq!(result, 1);

        // Check that the item was added
        let items = service.all_drug_interactions().await.unwrap();

        let mut found = false;
        for item in items.data {
            if item.interaction_id == new_interaction_id {
                assert_eq!(item.drugs.len(), 0);
                assert_eq!(item.groups.len(), 2);
                found = true;
                break;
            }
        }
        assert!(found);
        // Delete the newly created interaction
        let _result = service
            .delete_drug_interaction_group(
                service_provider.clone(),
                context.user_id.clone(),
                new_interaction_id.clone(),
            )
            .await
            .unwrap();

        // Delete the newly created groups
        let _result = service
            .delete_drug_interaction_group(
                service_provider.clone(),
                context.user_id.clone(),
                new_interaction_group_id_1.clone(),
            )
            .await
            .unwrap();

        let _result = service
            .delete_drug_interaction_group(
                service_provider.clone(),
                context.user_id.clone(),
                new_interaction_group_id_2.clone(),
            )
            .await
            .unwrap();
    }

    #[actix_rt::test]
    async fn add_drug_interaction_errors() {
        let (_, _, connection_manager, _) =
            setup_all("add_drug_interaction_errors", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.drug_interaction_service;

        let new_interaction_id = uuid();

        let input = UpsertDrugInteraction {
            interaction_id: new_interaction_id.clone(),
            name: new_interaction_id.clone(),
            description: "This checks we don't allow group and drug at the same time".to_string(),
            severity: dgraph::DrugInteractionSeverity::NothingExpected,
            action: String::new(),
            reference: String::new(),
            drug_code_1: Some("c9896104".to_string()),
            drug_code_2: Some("49e96100".to_string()),
            interaction_group_id_1: Some("ABC".to_string()),
            interaction_group_id_2: None,
        };

        let result = service
            .upsert_drug_interaction(service_provider.clone(), context.user_id.clone(), input)
            .await;

        assert!(result.is_err());
    }
}

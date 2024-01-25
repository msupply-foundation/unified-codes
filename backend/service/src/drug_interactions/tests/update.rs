#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod test {
    use repository::{mock::MockDataInserts, test_db::setup_all};
    use std::sync::Arc;
    use util::uuid::uuid;

    use crate::drug_interactions::upsert::UpsertDrugInteractionGroup;
    use crate::service_provider::ServiceContext;
    use crate::service_provider::ServiceProvider;

    use crate::test_utils::get_test_settings;

    #[actix_rt::test]
    async fn update_interaction_group_success() {
        let (_, _, connection_manager, _) =
            setup_all("update_interaction_group_success", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.drug_interaction_service;

        let new_interaction_group_id = uuid();
        let group_name = "ig_update_test".to_string();
        let input = UpsertDrugInteractionGroup {
            interaction_group_id: new_interaction_group_id.clone(),
            name: group_name.clone(),
            description: None,
            drugs: vec![],
        };

        let result = service
            .upsert_drug_interaction_group(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();
        assert_eq!(result, 1);

        // Check that the item was added
        let items = service.all_drug_interaction_groups().await.unwrap();

        let mut found = false;
        for item in items.data {
            if item.interaction_group_id == new_interaction_group_id {
                found = true;
                break;
            }
        }
        assert!(found);

        // Try adding a drug

        let input = UpsertDrugInteractionGroup {
            interaction_group_id: new_interaction_group_id.clone(),
            name: group_name.clone(),
            description: None,
            drugs: vec!["c7750265".to_string()],
        };

        let _result = service
            .upsert_drug_interaction_group(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();

        // Check that the item was added

        let items = service.all_drug_interaction_groups().await.unwrap();
        for item in items.data {
            if item.interaction_group_id == new_interaction_group_id {
                assert_eq!(item.drugs.len(), 1);
                assert_eq!(item.drugs[0].code, "c7750265");
                break;
            }
        }

        // Try removing a drug and adding a different drug

        let input = UpsertDrugInteractionGroup {
            interaction_group_id: new_interaction_group_id.clone(),
            name: group_name.clone(),
            description: None,
            drugs: vec!["7c8c2b5b".to_string()], // This is a different drug, so c7750265 should be removed and this added
        };

        let result = service
            .upsert_drug_interaction_group(service_provider.clone(), context.user_id.clone(), input)
            .await
            .unwrap();

        assert_eq!(result, 1);

        // Check that the drugs were updated
        let items = service.all_drug_interaction_groups().await.unwrap();
        for item in items.data {
            if item.interaction_group_id == new_interaction_group_id {
                assert_eq!(item.drugs.len(), 1);
                assert_eq!(item.drugs[0].code, "7c8c2b5b");
                break;
            }
        }

        // Delete the test group
        let _result = service
            .delete_drug_interaction_group(
                service_provider.clone(),
                context.user_id.clone(),
                new_interaction_group_id.clone(),
            )
            .await
            .unwrap();
    }
}

#[cfg(test)]
// #[cfg(feature = "dgraph-tests")]
mod test {
    use repository::{mock::MockDataInserts, test_db::setup_all};
    use std::sync::Arc;
    use util::uuid::uuid;

    use crate::drug_interactions::insert::AddInteractionGroup;
    use crate::service_provider::ServiceContext;
    use crate::service_provider::ServiceProvider;

    use crate::test_utils::get_test_settings;

    #[actix_rt::test]
    async fn add_interaction_group_success() {
        let (_, _, connection_manager, _) =
            setup_all("add_interaction_group_success", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::as_server_admin(service_provider.clone()).unwrap();
        let service = &context.service_provider.drug_interaction_service;

        let new_interaction_group_id = uuid();
        let group_name = "test_group".to_string();
        let input = AddInteractionGroup {
            interaction_group_id: new_interaction_group_id.clone(),
            name: group_name.clone(),
            description: None,
            drugs: vec![],
        };

        let result = service
            .add_drug_interaction_group(service_provider.clone(), context.user_id.clone(), input)
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

        // Delete the newly created code
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

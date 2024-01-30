#[cfg(test)]
mod repository_test {
    mod data {
        use crate::db_diesel::*;

        pub fn user_account_1() -> UserAccountRow {
            UserAccountRow {
                id: "user1".to_string(),
                username: "user 1".to_string(),
                hashed_password: "p1".to_string(),
                email: Some("email".to_string()),
                display_name: "user 1".to_string(),
                password_reset_token: None,
                password_reset_datetime: None,
            }
        }
        pub fn user_account_2() -> UserAccountRow {
            UserAccountRow {
                id: "user2".to_string(),
                username: "user 2".to_string(),
                hashed_password: "p2".to_string(),
                email: None,
                display_name: "user2".to_string(),
                password_reset_token: None,
                password_reset_datetime: None,
            }
        }
    }

    use crate::{
        mock::MockDataInserts, test_db, KeyValueStoreRepository, KeyValueType,
        UserAccountRowRepository,
    };

    #[actix_rt::test]
    async fn test_user_account_repository() {
        let settings = test_db::get_test_db_settings("user-account-repository");
        let connection_manager = test_db::setup(&settings).await;
        let connection = connection_manager.connection().unwrap();

        let repo = UserAccountRowRepository::new(&connection);
        let item1 = data::user_account_1();
        repo.insert_one(&item1).unwrap();
        let loaded_item = repo.find_one_by_id(item1.id.as_str()).unwrap();
        assert_eq!(item1, loaded_item.unwrap());

        // optional email
        let item2 = data::user_account_2();
        repo.insert_one(&item2).unwrap();
        let loaded_item = repo.find_one_by_id(item2.id.as_str()).unwrap();
        assert_eq!(item2, loaded_item.unwrap());
    }

    #[actix_rt::test]
    async fn test_key_value_store() {
        let (_, connection, _, _) =
            test_db::setup_all("key_value_store", MockDataInserts::none()).await;

        let repo = KeyValueStoreRepository::new(&connection);

        // access a non-existing row
        let result = repo.get_string(KeyValueType::SettingsTokenSecret).unwrap();
        assert_eq!(result, None);

        // write a string value
        repo.set_string(KeyValueType::SettingsTokenSecret, Some("test".to_string()))
            .unwrap();
        let result = repo.get_string(KeyValueType::SettingsTokenSecret).unwrap();
        assert_eq!(result, Some("test".to_string()));

        // unset a string value
        repo.set_string(KeyValueType::SettingsTokenSecret, None)
            .unwrap();
        let result = repo.get_string(KeyValueType::SettingsTokenSecret).unwrap();
        assert_eq!(result, None);
    }
}

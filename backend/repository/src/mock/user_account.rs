use crate::UserAccountRow;

// users

pub fn mock_user_accounts() -> Vec<UserAccountRow> {
    vec![
        mock_user_account_a(),
        mock_user_account_b(),
        mock_user_account_username_x(),
        mock_user_account_display_name_x(),
    ]
}

pub fn mock_user_account_a() -> UserAccountRow {
    UserAccountRow {
        id: String::from("id_user_account_a"),
        username: String::from("username_a"),
        hashed_password: String::from(
            "$2a$12$r44KN8LOqxSyn1VhU16AjuvJyWRnlE51zBDeuPFxkgbhjPDfNLxAG",
        ), // hashed version of `password`
        email: Some(String::from("username_a@openmsupply.foundation")),
        display_name: String::from("user_account_a"),
        password_reset_token: None,
        password_reset_datetime: None,
    }
}

pub fn mock_user_account_b() -> UserAccountRow {
    UserAccountRow {
        id: String::from("id_user_account_b"),
        username: String::from("username_b"),
        hashed_password: String::from("password_b"),
        email: Some(String::from("username_b@openmsupply.foundation")),
        display_name: String::from("user_account_b"),
        password_reset_token: None,
        password_reset_datetime: None,
    }
}

pub fn mock_user_account_username_x() -> UserAccountRow {
    UserAccountRow {
        id: String::from("id_user_account_c"),
        username: String::from("username_x"),
        hashed_password: String::from("password_c"),
        email: Some(String::from("username_c@openmsupply.foundation")),
        display_name: String::from("user_account_c"),
        password_reset_token: None,
        password_reset_datetime: None,
    }
}

pub fn mock_user_account_display_name_x() -> UserAccountRow {
    UserAccountRow {
        id: String::from("id_user_account_d"),
        username: String::from("username_d"),
        hashed_password: String::from("password_d"),
        email: Some(String::from("username_d@openmsupply.foundation")),
        display_name: String::from("user_account_x"),
        password_reset_token: None,
        password_reset_datetime: None,
    }
}

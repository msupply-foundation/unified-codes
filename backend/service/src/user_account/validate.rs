use repository::{EqualFilter, StringFilter};
use repository::{
    RepositoryError, StorageConnection, UserAccountFilter, UserAccountRepository, UserAccountRow,
    UserAccountRowRepository,
};
use util::is_valid_username;

pub fn check_username_doesnt_contain_special_characters(
    username: &str,
) -> Result<bool, RepositoryError> {
    Ok(!is_valid_username(username.trim()))
}

pub fn check_username_is_unique(
    id: &str,
    username: Option<String>,
    connection: &StorageConnection,
) -> Result<bool, RepositoryError> {
    match username {
        None => Ok(true),
        Some(username) => {
            let user_accounts = UserAccountRepository::new(connection).query_by_filter(
                UserAccountFilter::new()
                    .username(StringFilter::equal_to(&username.trim().to_lowercase()))
                    .id(EqualFilter::not_equal_to(id)),
            )?;

            Ok(user_accounts.is_empty())
        }
    }
}

pub fn check_user_account_exists(
    id: &str,
    connection: &StorageConnection,
) -> Result<Option<UserAccountRow>, RepositoryError> {
    UserAccountRowRepository::new(connection).find_one_by_id(id)
}

pub fn check_user_account_does_not_exist(
    id: &str,
    connection: &StorageConnection,
) -> Result<bool, RepositoryError> {
    let user_account = check_user_account_exists(id, connection)?;

    Ok(user_account.is_none())
}

#[cfg(test)]
mod test {
    use super::check_username_doesnt_contain_special_characters;

    fn username_char_test(username: &str, expected: bool) -> Result<(), String> {
        let result = check_username_doesnt_contain_special_characters(username).unwrap();
        if result != expected {
            Err(format!(
                "check_username_doesnt_contain_special_characters {} result: {}, expected: {}",
                username, result, expected
            ))
        } else {
            Ok(())
        }
    }

    #[test]
    fn test_good_usernames() -> Result<(), String> {
        [
            "admin",
            "account_a",
            "kids_of_88",
            "robert@example.com",
            "robert+hsh@example.com",
            "myusername_has_a_space ",
        ]
        .iter()
        .try_for_each(|username| username_char_test(*username, true))?;

        Ok(())
    }

    #[test]
    fn test_bad_usernames() -> Result<(), String> {
        ["admi%", "Robert'); DROP TABLE Students;--"]
            .iter()
            .try_for_each(|username| username_char_test(*username, false))?;

        Ok(())
    }
}

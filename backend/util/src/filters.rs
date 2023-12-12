use lazy_static::lazy_static;
use regex::Regex;

lazy_static! {
    // Regex to replace passwords with ****
    // Note: This regex assumes passwords are in json fields (surrounded by quotes)
    static ref REGEX_PASSWORD: Regex = Regex::new(r#"(?P<passwd>"?password"?)\s?:\s?"(\\"|[^"])+"#).unwrap();
}

pub fn replace_passwords(json: String) -> String {
    let result = REGEX_PASSWORD
        .replace_all(&json, r#"$passwd:"****"#)
        .to_string();
    result
}

#[cfg(test)]
mod test {
    use crate::filters::replace_passwords;

    #[test]
    fn test_replace_passwords() {
        let simple_test_string = r#"{"password":"pass"}"#;
        let replaced = replace_passwords(simple_test_string.to_string());
        assert_eq!(replaced, r#"{"password":"****"}"#);

        let complex_test_string = r#"{"password":"pass\"$@&*("}"#;
        let replaced = replace_passwords(complex_test_string.to_string());
        assert_eq!(replaced, r#"{"password":"****"}"#);

        let complex_test_string2 = r#"{"password":"pass)stillmorepassword"}"#;
        let replaced = replace_passwords(complex_test_string2.to_string());
        assert_eq!(replaced, r#"{"password":"****"}"#);

        let auth_token_test_string = r#"query authToken($username: String!, $password: String!) { authToken(password: "pass", username: "donald") { ... on AuthTokenError { __typename error { ... on InvalidCredentials { __typename description } description } } ... on AuthToken { __typename token } }"#;
        let replaced = replace_passwords(auth_token_test_string.to_string());
        assert_eq!(
            replaced,
            r#"query authToken($username: String!, $password: String!) { authToken(password:"****", username: "donald") { ... on AuthTokenError { __typename error { ... on InvalidCredentials { __typename description } description } } ... on AuthToken { __typename token } }"#
        );

        // NOTE: This does't get replaced as it's not a valid json string (password needs to be in quotes)
        // We either have this or we have a false/incorrect replacement for  $password: String!) etc which actually is incorrect REGEX isn't ideal for this!
        let potentially_broken_case = r#"password : SecretPassword"#;
        let replaced = replace_passwords(potentially_broken_case.to_string());
        assert_eq!(replaced, r#"password : SecretPassword"#);
    }
}

use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DgraphClient, UpsertResponse, UpsertResponseData};

#[derive(Serialize, Debug, Clone)]
pub struct ConfigurationItemInput {
    pub code: String,
    pub name: String,
    pub r#type: String,
}

#[derive(Serialize, Debug, Clone)]
struct UpsertVars {
    input: ConfigurationItemInput,
    upsert: bool,
}

pub async fn insert_configuration_item(
    client: &DgraphClient,
    config_item: ConfigurationItemInput,
    upsert: bool,
) -> Result<UpsertResponse, GraphQLError> {
    let query = r#"
mutation AddConfigurationInput($input: [AddConfigurationItemInput!]!, $upsert: Boolean = false) {
  data: addConfigurationItem(input: $input, upsert: $upsert) {
    numUids
  }
}"#;
    let variables = UpsertVars {
        input: config_item,
        upsert: upsert,
    };

    let result = client
        .query_with_retry::<UpsertResponseData, UpsertVars>(&query, variables)
        .await?;

    match result {
        Some(result) => {
            return Ok(UpsertResponse {
                numUids: result.data.numUids,
            })
        }
        None => return Ok(UpsertResponse { numUids: 0 }),
    }
}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod tests {
    use util::uuid::uuid;

    use crate::configuration_items::configuration_items;
    use crate::configuration_items::ConfigurationItemFilter;

    use super::*;

    #[tokio::test]
    async fn test_insert_configuration_item() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let code = uuid();
        let config_type = "test_type".to_string();

        // Create a new configuration item
        let config_item = ConfigurationItemInput {
            code: code.clone(),
            name: "test_name".to_string(),
            r#type: config_type.clone(),
        };

        let result = insert_configuration_item(&client, config_item, true).await;
        if result.is_err() {
            println!(
                "insert_config_item err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());

        // Check we can find the new record in when filtering by type
        let variables = ConfigurationItemFilter {
            r#type: config_type,
        };
        let result = configuration_items(&client, variables).await;
        if result.is_err() {
            println!(
                "configuration_items err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        };
        let data = result.unwrap().unwrap();
        assert!(data.data.len() > 0);
        let mut found = false;
        for item in data.data {
            if item.code == code {
                found = true;
                break;
            }
        }
        assert!(found);
    }
}

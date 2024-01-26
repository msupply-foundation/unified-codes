use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DgraphClient, UpsertResponse, UpsertResponseData};

#[derive(Serialize, Debug, Clone)]
pub struct PropertyConfigurationItemInput {
    pub label: String,
    pub url: String,
    pub r#type: String,
}

#[derive(Serialize, Debug, Clone)]
struct UpsertVars {
    input: PropertyConfigurationItemInput,
    upsert: bool,
}

pub async fn upsert_property_config_item(
    client: &DgraphClient,
    property_config_item: PropertyConfigurationItemInput,
    upsert: bool,
) -> Result<UpsertResponse, GraphQLError> {
    let query = r#"
mutation UpsertPropertyConfigurationInput($input: [AddPropertyConfigurationItemInput!]!, $upsert: Boolean = false) {
  data: addPropertyConfigurationItem(input: $input, upsert: $upsert) {
    numUids
  }
}"#;
    let variables = UpsertVars {
        input: property_config_item,
        upsert,
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

    use crate::property_configuration_items::property_configuration_items;

    use super::*;

    #[tokio::test]
    async fn test_upsert_property_config_item() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let config_type = uuid();

        // Create a new property configuration item
        let config_item = PropertyConfigurationItemInput {
            url: "".to_string(),
            label: "label".to_string(),
            r#type: config_type.clone(),
        };

        let result = upsert_property_config_item(&client, config_item, true).await;
        if result.is_err() {
            println!(
                "upsert_property_config_item err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());

        // Check we can find the new record
        let result = property_configuration_items(&client).await;
        if result.is_err() {
            println!(
                "property_configuration_items err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        };
        let data = result.unwrap().unwrap();
        assert!(data.data.len() > 0);
        let mut found = false;
        for item in data.data {
            if item.r#type == config_type.clone() {
                assert_eq!(item.url, "".to_string());
                found = true;
                break;
            }
        }
        assert!(found);

        // Check we can update it
        let config_item = PropertyConfigurationItemInput {
            url: "new url".to_string(),
            label: "label".to_string(),
            r#type: config_type.clone(),
        };

        let result = upsert_property_config_item(&client, config_item, true).await;
        if result.is_err() {
            println!(
                "upsert_property_config_item err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());

        // Check the record is updated
        let result = property_configuration_items(&client).await;
        if result.is_err() {
            println!(
                "property_configuration_items err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        };
        let data = result.unwrap().unwrap();
        assert!(data.data.len() > 0);

        let mut found = false;
        for item in data.data {
            if item.r#type == config_type {
                assert_eq!(item.url, "new url".to_string());
                found = true;
                break;
            }
        }
        assert!(found);

        //  -- DELETE FROM DGRAPH --
        #[derive(Serialize, Debug, Clone)]
        struct DeleteVars {
            r#type: String,
        }

        let query = r#"
mutation DeleteTestConfig($type: String!) {
  data: deletePropertyConfigurationItem(filter: { type: { eq: $type }}) {
    numUids
  }
}"#;

        let _result = client
            .query_with_retry::<UpsertResponseData, DeleteVars>(
                &query,
                DeleteVars {
                    r#type: config_type,
                },
            )
            .await;
    }
}

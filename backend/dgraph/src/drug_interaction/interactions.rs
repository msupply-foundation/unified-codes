use gql_client::GraphQLError;
use serde::Serialize;

use crate::DgraphClient;
use crate::DrugInteractionsData;

#[derive(Serialize, Debug, Clone)]
pub struct DrugInteractionFilter {
    pub name: Option<String>,
}

pub async fn interactions(
    client: &DgraphClient,
    filter: Option<DrugInteractionFilter>,
) -> Result<Option<DrugInteractionsData>, GraphQLError> {
    let data = match filter {
        Some(filter) => {
            let query = r#"
query drugInteractions($name: String) {
  data: queryDrugInteraction(filter: {name: {eq: $name}}) {
    interaction_id
    name
    description
    action
    severity
    drugs {
        name
        description
        type
        code
    }
    groups {
        interaction_group_id
        name
        description
        drugs {
            name
            description
            type
            code
        }
    }
  }
}
"#;
            client
                .gql
                .query_with_vars::<DrugInteractionsData, DrugInteractionFilter>(query, filter)
                .await?
        }
        None => {
            let query = r#"
query drugInteractions {
    data: queryDrugInteraction() {
    interaction_id
    name
    description
    action
    severity
    drugs {
        name
        description
        type
        code
    }
    groups {
        interaction_group_id
        name
        description
        drugs {
            name
            description
            type
            code
        }
    }
    }
}"#;

            client.gql.query::<DrugInteractionsData>(query).await?
        }
    };

    Ok(data)
}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod tests {

    use super::*;

    #[tokio::test]
    async fn test_no_filter() {
        let client = DgraphClient::new("http://localhost:8080/graphql");
        let result = interactions(&client, None).await;
        if result.is_err() {
            println!("{:#?}", result.clone().unwrap_err().json());
        }
        let _data = result.unwrap().unwrap();
    }

    #[tokio::test]
    async fn test_name_filter() {
        let client = DgraphClient::new("http://localhost:8080/graphql");
        let result = interactions(
            &client,
            Some(DrugInteractionFilter {
                name: Some("test".to_string()),
            }),
        )
        .await;
        if result.is_err() {
            println!("{:#?}", result.clone().unwrap_err().json());
        }
        let _data = result.unwrap().unwrap();
    }
}

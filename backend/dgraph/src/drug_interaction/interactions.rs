use gql_client::GraphQLError;
use serde::Serialize;

use crate::DgraphClient;
use crate::DrugInteractionsData;

#[derive(Serialize, Debug, Clone)]
pub struct Vars {
    pub name: Option<String>,
}

pub async fn interactions(
    client: &DgraphClient,
    name_filter: Option<String>,
) -> Result<Option<DrugInteractionsData>, GraphQLError> {
    let data = match name_filter {
        Some(name) => {
            let query = r#"
query drugInteractions($name: String) {
  data: queryDrugInteraction(filter: {name: {eq: $name}}) {
    interaction_id
    name
    description
    action
    severity
    reference
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
            let vars = Vars { name: Some(name) };
            client
                .gql
                .query_with_vars::<DrugInteractionsData, Vars>(query, vars)
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
    reference
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
        let result = interactions(&client, Some("test".to_string())).await;
        if result.is_err() {
            println!("{:#?}", result.clone().unwrap_err().json());
        }
        let _data = result.unwrap().unwrap();
    }
}

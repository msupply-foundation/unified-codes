use gql_client::GraphQLError;
use serde::Deserialize;
use serde::Serialize;

use crate::DgraphClient;
use crate::Entity;

#[derive(Deserialize, Debug, Clone)]
pub struct InteractionGroup {
    pub interaction_group_id: String,
    pub name: String,
    pub description: Option<String>,
    pub drugs: Vec<Entity>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct InteractionGroupData {
    pub data: Vec<InteractionGroup>,
}

#[derive(Serialize, Debug, Clone)]
pub struct InteractionGroupFilter {
    pub name: Option<String>,
}

pub async fn interaction_groups(
    client: &DgraphClient,
    filter: Option<InteractionGroupFilter>,
) -> Result<Option<InteractionGroupData>, GraphQLError> {
    let data = match filter {
        Some(filter) => {
            let query = r#"
query drugInteractionGroups($name: String) {
  data: queryDrugInteractionGroup(filter: {name: {eq: $name}}) {
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
"#;
            client
                .gql
                .query_with_vars::<InteractionGroupData, InteractionGroupFilter>(query, filter)
                .await?
        }
        None => {
            let query = r#"
query drugInteractionGroups {
    data: queryDrugInteractionGroup() {
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
}"#;

            client.gql.query::<InteractionGroupData>(query).await?
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
        let result = interaction_groups(&client, None).await;
        if result.is_err() {
            println!("{:#?}", result.clone().unwrap_err().json());
        }
        // println!("{:#?}", result);
        let _data = result.unwrap().unwrap();
        // Note, this will fail if you haven't created any interaction_groups in dgraph
        // assert!(data.data.len() > 0);
    }
}

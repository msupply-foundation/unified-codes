use gql_client::GraphQLError;
use serde::Serialize;

use crate::DgraphClient;
use crate::InteractionGroup;
use crate::InteractionGroupData;

#[derive(Serialize, Debug, Clone)]
struct InteractionGroupVars {
    interaction_group_id: String,
}

pub async fn interaction_group_by_id(
    client: &DgraphClient,
    interaction_group_id: String,
) -> Result<Option<InteractionGroup>, GraphQLError> {
    let query = r#"
query InteractionGroup($interaction_group_id: String = "") {
  data: getDrugInteractionGroup(interaction_group_id: $interaction_group_id) {
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

    let vars = InteractionGroupVars {
        interaction_group_id,
    };

    let data = client
        .gql
        .query_with_vars::<InteractionGroupData, InteractionGroupVars>(query, vars)
        .await?;

    let group = match data {
        Some(data) => data.data,
        None => None,
    };

    Ok(group)
}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod tests {

    use util::uuid::uuid;

    use crate::{
        delete_interaction_group::delete_interaction_group,
        insert_interaction_group::{insert_interaction_group, InteractionGroupInput},
    };

    use super::*;

    #[tokio::test]
    async fn test_group_by_id() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let group_id = uuid();
        let group_name = "test_group_by_id".to_string();
        let group = InteractionGroupInput {
            interaction_group_id: group_id.clone(),
            name: group_name.clone(),
            description: Some("This is just for testing, please feel free to remove".to_string()),
            drugs: vec![],
        };

        let result = insert_interaction_group(&client, group.clone(), false).await;
        if result.is_err() {
            println!(
                "insert_interaction_group err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());

        let result = interaction_group_by_id(&client, group_id.clone()).await;
        if result.is_err() {
            println!(
                "interaction_group_by_id err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());
        let group = result.unwrap();
        assert!(group.is_some());
        let group = group.unwrap();
        assert_eq!(group.name, group_name);

        // Delete the group
        let result = delete_interaction_group(&client, group_id.clone()).await;
        assert!(result.is_ok());
    }
}

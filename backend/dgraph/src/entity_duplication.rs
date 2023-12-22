use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DgraphClient, EntityData};

#[derive(Serialize, Debug)]
pub struct DuplicationCheckVars {
    pub code: String,
    pub name: String,
}

pub async fn check_description_duplication(
    client: &DgraphClient,
    description: String,
    existing_code: String,
) -> Result<Option<EntityData>, GraphQLError> {
    let query = r#"
query DuplicationCheck($code: String!, $name: String!) {
  data: queryEntity(filter: 
    	{
        not: {code: {eq: $code}}
        description: {eq: $name}
      }
    ) {
    code
    name
    description
    type
  }
}
"#;

    let variables = DuplicationCheckVars {
        code: existing_code,
        name: description,
    };
    let result = client
        .gql
        .query_with_vars::<EntityData, DuplicationCheckVars>(query, variables)
        .await?;

    Ok(result)
}

#[cfg(test)]
mod tests {

    use super::*;

    #[tokio::test]
    async fn test_description_dup() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        // Check we get nothing back when the code matches the description
        let result = check_description_duplication(
            &client,
            "Heparin Sodium".to_string(),
            "10808942".to_string(),
        )
        .await;
        if result.is_err() {
            println!("{:#?}", result.clone().unwrap_err().json());
        }
        // println!("{:#?}", result);
        let data = result.unwrap().unwrap();
        assert_eq!(data.data.len(), 0);

        // Check we get something back when a different code matches the description
        let result = check_description_duplication(
            &client,
            "Heparin Sodium".to_string(),
            "10808943".to_string(),
        )
        .await;
        if result.is_err() {
            println!("{:#?}", result.clone().unwrap_err().json());
        }
        // println!("{:#?}", result);
        let data = result.unwrap().unwrap();
        assert_eq!(data.data.len(), 1);
    }
}

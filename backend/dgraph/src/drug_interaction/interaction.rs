use gql_client::GraphQLError;
use serde::Serialize;

use crate::DgraphClient;
use crate::DrugInteraction;
use crate::DrugInteractionData;

#[derive(Serialize, Debug, Clone)]
struct InteractionVars {
    interaction_id: String,
}

pub async fn interaction_by_id(
    client: &DgraphClient,
    interaction_id: String,
) -> Result<Option<DrugInteraction>, GraphQLError> {
    let query = r#"
query DrugInteraction($interaction_id: String = "") {
  data: getDrugInteraction(interaction_id: $interaction_id) {
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

    let vars = InteractionVars { interaction_id };

    let data = client
        .gql
        .query_with_vars::<DrugInteractionData, InteractionVars>(query, vars)
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
        delete_interaction::delete_interaction,
        insert_interaction::{insert_drug_interaction, DrugInteractionInput},
        DrugCode, DrugInteractionSeverity,
    };

    use super::*;

    #[tokio::test]
    async fn test_interaction_by_id() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let interaction_id = uuid();

        // Create a new Interaction Drug to Drug

        let interaction = DrugInteractionInput {
            interaction_id: interaction_id.clone(),
            name: "A-Z".to_string(),
            severity: DrugInteractionSeverity::Severe,
            description: "Aciclovir/Zidovudine".to_string(),
            action: "Never prescribe".to_string(),
            reference: "reference".to_string(),
            drugs: vec![
                DrugCode {
                    code: "18e10fbb".to_string(),
                },
                DrugCode {
                    code: "02ac6c47".to_string(),
                },
            ],
            groups: vec![],
        };

        let result = insert_drug_interaction(&client, interaction, true).await;
        if result.is_err() {
            println!(
                "insert_drug_interaction err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());

        // Get the interaction by id
        let result = interaction_by_id(&client, interaction_id.clone()).await;
        assert!(result.is_ok());
        let interaction = result.unwrap().unwrap();
        assert_eq!(interaction.interaction_id, interaction_id);
        assert_eq!(interaction.name, "A-Z".to_string());
        assert_eq!(interaction.severity, Some(DrugInteractionSeverity::Severe));
        assert_eq!(
            interaction.description,
            Some("Aciclovir/Zidovudine".to_string())
        );
        assert_eq!(interaction.action, Some("Never prescribe".to_string()));
        assert_eq!(interaction.reference, Some("reference".to_string()));
        assert_eq!(interaction.drugs.len(), 2);

        // Delete the interaction
        let result = delete_interaction(&client, interaction_id.clone()).await;
        assert!(result.is_ok());
    }
}

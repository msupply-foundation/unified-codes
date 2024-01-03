use crate::{
    audit_log::audit_log_entry,
    service_provider::{self, ServiceContext},
    universal_codes::code_generator::generate_code,
};
use chrono::Utc;
use dgraph::{
    check_description_duplication, entity_by_code, Entity, EntityInput, GraphQLError, PropertyInput,
};
use repository::{LogType, RepositoryError, StorageConnection};

use super::properties::PropertyReference;

#[derive(Debug)]
pub enum ModifyUniversalCodeError {
    UniversalCodeDoesNotExist,
    UniversalCodeAlreadyExists,
    DescriptionAlreadyExists(String),
    NotAuthorised,
    InternalError(String),
    DatabaseError(RepositoryError),
    DgraphError(GraphQLError),
}

impl From<RepositoryError> for ModifyUniversalCodeError {
    fn from(error: RepositoryError) -> Self {
        ModifyUniversalCodeError::DatabaseError(error)
    }
}

impl From<GraphQLError> for ModifyUniversalCodeError {
    fn from(error: GraphQLError) -> Self {
        ModifyUniversalCodeError::DgraphError(error)
    }
}

#[derive(Clone, Debug)]
pub struct UpsertUniversalCode {
    pub code: Option<String>,
    pub parent_code: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub r#type: Option<String>,
    pub category: Option<String>,
    pub properties: Option<Vec<PropertyReference>>,
    pub children: Option<Vec<UpsertUniversalCode>>,
}

pub async fn upsert_entity(
    // ctx: &ServiceContext,
    client: dgraph::DgraphClient,
    updated_entity: UpsertUniversalCode,
) -> Result<Entity, ModifyUniversalCodeError> {
    // Create a code if it doesn't already exist...
    let updated_entity = match updated_entity.code.is_some() {
        true => updated_entity,
        false => UpsertUniversalCode {
            code: Some(generate_code()),
            ..updated_entity
        }, // TODO: Check code is unique
    };

    let mut child_handles = vec![];
    // First process any children
    if let Some(children) = updated_entity.children.clone() {
        for child in children {
            // Using spawn_local partly to avoid errors with async recursion
            // https://docs.rs/async-recursion/latest/async_recursion/ would be another approach, but this also gets us some parallelism
            let result = tokio::task::spawn_local(upsert_entity(client.clone(), child));
            child_handles.push(result);
        }
    }

    // Wait for the children to finish
    // Collect the codes of any children, as their codes might be generated in the recursion
    let mut child_codes = vec![];
    for handle in child_handles {
        let result = handle.await;
        let child_entity = match result {
            Ok(child_entity) => child_entity?,
            Err(e) => {
                return Err(ModifyUniversalCodeError::InternalError(format!(
                    "Failed to get child entity: {}",
                    e
                )))
            }
        };
        child_codes.push(child_entity.code);
    }

    // Validate
    let _original_entity = validate(&client, &updated_entity).await?;

    // Generate
    let entity_input = generate(updated_entity.clone())?;

    let _result = dgraph::upsert_entity(&client, entity_input.clone()).await?;

    // Link any children to the new entity
    for child_code in child_codes {
        dgraph::link_entities(&client, entity_input.code.clone(), child_code).await?;
    }

    // Link to parent (if provided)
    if let Some(parent_code) = updated_entity.parent_code.clone() {
        dgraph::link_entities(&client, parent_code, entity_input.code.clone()).await?;
    }

    // Query to get the updated record
    let updated_entity = entity_by_code(&client, entity_input.code)
        .await
        .map_err(|e| {
            ModifyUniversalCodeError::InternalError(format!(
                "Failed to get updated entity by code: {}",
                e.message()
            ))
        })?;

    let updated_entity = match updated_entity {
        Some(updated_entity) => updated_entity,
        None => {
            return Err(ModifyUniversalCodeError::InternalError(
                "Unable to find updated entity".to_string(),
            ))
        }
    };

    // Audit logging
    // match original_entity {
    //     Some(original_entity) => {
    //         audit_log_entry(
    //             &ctx,
    //             LogType::UniversalCodeUpdated,
    //             Some(original_entity.code),
    //             Utc::now().naive_utc(),
    //         )?;
    //     }
    //     None => {
    //         audit_log_entry(
    //             &ctx,
    //             LogType::UniversalCodeCreated,
    //             Some(updated_entity.code.clone()),
    //             Utc::now().naive_utc(),
    //         )?;
    //     }
    // }

    Ok(updated_entity)
}

pub fn generate(
    updated_entity: UpsertUniversalCode,
) -> Result<EntityInput, ModifyUniversalCodeError> {
    println!("generate: {:?}", updated_entity);

    Ok(EntityInput {
        code: updated_entity
            .code
            .clone()
            .unwrap_or_else(|| generate_code()),
        name: updated_entity.name.clone(),
        description: updated_entity.description.clone(),
        r#type: updated_entity.r#type.clone(),
        category: updated_entity.category.clone(),
        properties: updated_entity.properties.map(|properties| {
            properties
                .into_iter()
                .map(|p| PropertyInput {
                    key: p.key,
                    value: p.value,
                })
                .collect()
        }),
        children: None, // Children are handled by recursion
    })
}

pub async fn validate(
    // ctx: &ServiceContext,
    client: &dgraph::DgraphClient,
    new_entity: &UpsertUniversalCode,
) -> Result<Option<Entity>, ModifyUniversalCodeError> {
    // Check if entity exists with the same description
    if let Some(description) = new_entity.description.clone() {
        let duplicated = check_description_duplication(
            client,
            description,
            new_entity.code.clone().unwrap_or_default(), // If there is no code, it is a new entity and we want to see if the description is duplicated on any other entity
        )
        .await?;
        match duplicated {
            Some(duplicated) => {
                if duplicated.data.len() > 1 {
                    return Err(ModifyUniversalCodeError::DescriptionAlreadyExists(format!(
                        "Description {} is already in use on code {}",
                        duplicated.data[0].description, duplicated.data[0].code
                    )));
                }
            }
            None => {}
        }
    }

    // If we have no code, it is a new entity and the code will have been generated
    let original_entity = match new_entity.code.clone() {
        Some(code) => entity_by_code(client, code).await?,
        None => None,
    };

    if original_entity.is_none() {
        // Check all the field are filled in fields are not really optional on a new entity
        if new_entity.name.is_none() {
            return Err(ModifyUniversalCodeError::InternalError(
                "Name is required".to_string(),
            ));
        }
        if new_entity.description.is_none() {
            return Err(ModifyUniversalCodeError::InternalError(
                "Description is required".to_string(),
            ));
        }
        if new_entity.r#type.is_none() {
            return Err(ModifyUniversalCodeError::InternalError(
                "Type is required".to_string(),
            ));
        }
        if new_entity.category.is_none() {
            return Err(ModifyUniversalCodeError::InternalError(
                "Category is required".to_string(),
            ));
        }
        // TODO: check the type and category are valid
    }

    Ok(original_entity)
}

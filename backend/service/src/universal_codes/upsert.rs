use crate::{
    audit_log::audit_log_entry,
    service_provider::{self, ServiceContext},
};
use chrono::Utc;
use dgraph::{check_description_duplication, entity_by_code, Entity, EntityInput, GraphQLError};
use repository::{LogType, RepositoryError, StorageConnection};

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
    pub code: String,
    pub name: Option<String>,
    pub description: Option<String>,
    pub r#type: Option<String>,
    pub category: Option<String>,
}

pub async fn upsert_entity(
    // ctx: &ServiceContext,
    client: &dgraph::DgraphClient,
    updated_entity: UpsertUniversalCode,
) -> Result<Entity, ModifyUniversalCodeError> {
    // Validate
    let _original_entity = validate(client, &updated_entity).await?;

    // Generate
    let entity_input = generate(updated_entity.clone())?;

    let result = dgraph::upsert_entity(client, entity_input).await?;

    // Query to get the updated record
    let updated_entity = entity_by_code(client, updated_entity.code.clone())
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
        code: updated_entity.code.clone(),
        name: updated_entity.name.clone(),
        description: updated_entity.description.clone(),
        r#type: updated_entity.r#type.clone(),
        category: updated_entity.category.clone(),
    })
}

pub async fn validate(
    // ctx: &ServiceContext,
    client: &dgraph::DgraphClient,
    new_entity: &UpsertUniversalCode,
) -> Result<Option<Entity>, ModifyUniversalCodeError> {
    // Check if entity exists with the same description
    if let Some(description) = new_entity.description.clone() {
        let duplicated =
            check_description_duplication(client, description, new_entity.code.clone()).await?;
        match duplicated {
            Some(duplicated) => {
                if duplicated.data.len() > 1 {
                    return Err(ModifyUniversalCodeError::DescriptionAlreadyExists(format!(
                        "Description is already in use on code {}",
                        duplicated.data[0].code.clone()
                    )));
                }
            }
            None => {}
        }
    }

    let original_entity = entity_by_code(client, new_entity.code.clone()).await?;

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

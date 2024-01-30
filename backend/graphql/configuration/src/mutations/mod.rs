use async_graphql::*;
use graphql_core::standard_graphql_error::StandardGraphqlError;
use service::configuration::ModifyConfigurationError;

mod delete;
pub use delete::*;
mod insert;
pub use insert::*;
mod upsert_property;
pub use upsert_property::*;

pub fn map_modify_config_error(error: ModifyConfigurationError) -> Result<u32, Error> {
    use StandardGraphqlError::*;
    let formatted_error = format!("{:#?}", error);

    let graphql_error = match error {
        ModifyConfigurationError::InternalError(message) => InternalError(message),
        ModifyConfigurationError::DatabaseError(_) => InternalError(formatted_error),
        ModifyConfigurationError::DgraphError(gql_error) => {
            InternalError(format!("{:#?} - {:?}", gql_error, gql_error.json()))
        }
    };

    Err(graphql_error.extend())
}

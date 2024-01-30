use async_graphql::*;
use graphql_core::standard_graphql_error::StandardGraphqlError;
use service::gs1::ModifyGS1Error;

mod delete;
pub use delete::*;
mod insert;
pub use insert::*;

use crate::types::GS1Response;

pub fn map_modify_gs1_error(error: ModifyGS1Error) -> Result<GS1Response, Error> {
    use StandardGraphqlError::*;
    let formatted_error = format!("{:#?}", error);

    let graphql_error = match error {
        ModifyGS1Error::GS1AlreadyExists => BadUserInput(formatted_error),
        ModifyGS1Error::GS1DoesNotExist => BadUserInput(formatted_error),
        ModifyGS1Error::UniversalCodeDoesNotExist => BadUserInput(formatted_error),
        ModifyGS1Error::InternalError(message) => InternalError(message),
        ModifyGS1Error::DatabaseError(_) => InternalError(formatted_error),
        ModifyGS1Error::DgraphError(gql_error) => {
            InternalError(format!("{:#?} - {:?}", gql_error, gql_error.json()))
        }
    };

    Err(graphql_error.extend())
}

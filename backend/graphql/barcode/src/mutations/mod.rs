use async_graphql::*;
use graphql_core::standard_graphql_error::StandardGraphqlError;
use service::barcodes::ModifyBarcodeError;

mod delete;
pub use delete::*;
mod insert;
pub use insert::*;

use crate::types::BarcodeResponse;

pub fn map_modify_barcode_error(error: ModifyBarcodeError) -> Result<BarcodeResponse, Error> {
    use StandardGraphqlError::*;
    let formatted_error = format!("{:#?}", error);

    let graphql_error = match error {
        ModifyBarcodeError::BarcodeAlreadyExists => BadUserInput(formatted_error),
        ModifyBarcodeError::BarcodeDoesNotExist => BadUserInput(formatted_error),
        ModifyBarcodeError::UniversalCodeDoesNotExist => BadUserInput(formatted_error),
        ModifyBarcodeError::BadUserInput(message) => BadUserInput(message),
        ModifyBarcodeError::InternalError(message) => InternalError(message),
        ModifyBarcodeError::DatabaseError(_) => InternalError(formatted_error),
        ModifyBarcodeError::DgraphError(gql_error) => {
            InternalError(format!("{:#?} - {:?}", gql_error, gql_error.json()))
        }
    };

    Err(graphql_error.extend())
}

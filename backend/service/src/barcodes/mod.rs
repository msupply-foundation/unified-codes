use std::{
    fmt::{Display, Formatter},
    sync::Arc,
};

use dgraph::{
    barcode::barcode::barcode_by_gtin,
    barcodes::{barcodes, BarcodeQueryVars},
    Barcode, DgraphClient, GraphQLError,
};
use repository::RepositoryError;
use util::usize_to_u32;

use crate::{service_provider::ServiceProvider, settings::Settings};

#[derive(Debug)]
pub enum ModifyBarcodeError {
    BarcodeDoesNotExist,
    BarcodeAlreadyExists,
    UniversalCodeDoesNotExist,
    InternalError(String),
    DatabaseError(RepositoryError),
    DgraphError(GraphQLError),
}

impl From<RepositoryError> for ModifyBarcodeError {
    fn from(error: RepositoryError) -> Self {
        ModifyBarcodeError::DatabaseError(error)
    }
}

impl From<GraphQLError> for ModifyBarcodeError {
    fn from(error: GraphQLError) -> Self {
        ModifyBarcodeError::DgraphError(error)
    }
}

mod tests;

pub mod delete;
pub mod upsert;

pub struct BarcodeService {
    client: DgraphClient,
}

#[derive(Debug)]
pub enum BarcodeServiceError {
    InternalError(String),
    BadUserInput(String),
}

impl Display for BarcodeServiceError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            BarcodeServiceError::InternalError(details) => {
                write!(f, "Internal error: {}", details)
            }
            BarcodeServiceError::BadUserInput(details) => {
                write!(f, "Bad user input: {}", details)
            }
        }
    }
}

pub struct BarcodeCollection {
    pub data: Vec<Barcode>,
    pub total_length: u32,
}

impl BarcodeService {
    pub fn new(settings: Settings) -> Self {
        let url = format!(
            "{}:{}/graphql",
            settings.dgraph.host.clone(),
            settings.dgraph.port
        );

        BarcodeService {
            client: DgraphClient::new(&url),
        }
    }

    pub async fn barcodes(
        &self,
        first: Option<u32>,
        offset: Option<u32>,
    ) -> Result<BarcodeCollection, BarcodeServiceError> {
        let result = barcodes(&self.client, BarcodeQueryVars { first, offset })
            .await
            .map_err(|e| BarcodeServiceError::InternalError(e.message().to_string()))?; // TODO: Improve error handling?

        match result {
            Some(data) => Ok(BarcodeCollection {
                total_length: usize_to_u32(data.data.len()),
                data: data.data,
            }),
            None => Ok(BarcodeCollection {
                data: vec![],
                total_length: 0,
            }),
        }
    }

    pub async fn barcode_by_gtin(
        &self,
        gtin: String,
    ) -> Result<Option<Barcode>, BarcodeServiceError> {
        let result = barcode_by_gtin(&self.client, gtin)
            .await
            .map_err(|e| BarcodeServiceError::InternalError(e.message().to_string()))?; // TODO: Improve error handling?

        match result {
            Some(result) => Ok(Some(result)),
            None => Ok(None),
        }
    }

    pub async fn add_barcode(
        &self,
        sp: Arc<ServiceProvider>,
        user_id: String,
        item: upsert::AddBarcode,
    ) -> Result<Barcode, ModifyBarcodeError> {
        upsert::add_barcode(sp, user_id, self.client.clone(), item).await
    }

    pub async fn delete_barcode(
        &self,
        sp: Arc<ServiceProvider>,
        user_id: String,
        gtin: String,
    ) -> Result<u32, ModifyBarcodeError> {
        delete::delete_barcode(sp, user_id, self.client.clone(), gtin).await
    }
}

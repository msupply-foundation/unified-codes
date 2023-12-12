pub use async_graphql::*;

/// Generic Error Wrapper
#[derive(SimpleObject)]
#[graphql(concrete(name = "NodeError", params(NodeErrorInterface)))]
pub struct ErrorWrapper<T: OutputType> {
    pub error: T,
}

pub type NodeError = ErrorWrapper<NodeErrorInterface>;

// Generic Node Error Interface
#[derive(Interface)]
#[graphql(field(name = "description", type = "&str"))]
pub enum NodeErrorInterface {
    DatabaseError(DatabaseError),
    RecordNotFound(RecordNotFound),
}

impl NodeErrorInterface {
    pub fn record_not_found() -> NodeErrorInterface {
        NodeErrorInterface::RecordNotFound(RecordNotFound {})
    }
}

/// Convert from SingleRecordError (service result) to Generic single node error
impl From<SingleRecordError> for NodeError {
    fn from(error: SingleRecordError) -> Self {
        let error = match error {
            SingleRecordError::DatabaseError(error) => {
                NodeErrorInterface::DatabaseError(DatabaseError(error))
            }
            SingleRecordError::NotFound(_) => NodeErrorInterface::RecordNotFound(RecordNotFound),
        };

        ErrorWrapper { error }
    }
}

/// Convert from RepositoryError (loader result) to Generic single node error
impl From<RepositoryError> for NodeError {
    fn from(error: RepositoryError) -> Self {
        ErrorWrapper {
            error: NodeErrorInterface::DatabaseError(DatabaseError(error)),
        }
    }
}

// Generic Errors

use repository::RepositoryError;
use service::SingleRecordError;

pub struct AccessDenied(pub String);

#[Object]
impl AccessDenied {
    pub async fn description(&self) -> &'static str {
        "Access Denied"
    }

    pub async fn full_error(&self) -> &str {
        &self.0
    }
}

pub struct DatabaseError(pub RepositoryError);

#[Object]
impl DatabaseError {
    pub async fn description(&self) -> &'static str {
        "Database Error"
    }

    pub async fn full_error(&self) -> String {
        format!("{:#}", self.0)
    }
}

pub struct InternalError(pub String);

#[Object]
impl InternalError {
    pub async fn description(&self) -> &'static str {
        "Internal Error"
    }

    pub async fn full_error(&self) -> String {
        format!("Internal Error: {}", self.0)
    }
}

pub enum Range {
    Max(u32),
    Min(u32),
}

#[derive(Enum, Copy, Clone, PartialEq, Eq, Debug)]
#[graphql(rename_items = "camelCase")]
pub enum RangeField {
    First,
    NumberOfPacks,
    PackSize,
}

pub struct RangeError {
    pub field: RangeField,
    pub range: Range,
}

#[Object]
impl RangeError {
    pub async fn description(&self) -> &'static str {
        match &self.range {
            Range::Max(_) => "Value is above maximum",
            Range::Min(_) => "Value is below minimum",
        }
    }

    pub async fn field(&self) -> &RangeField {
        &self.field
    }

    pub async fn max(&self) -> Option<u32> {
        match &self.range {
            Range::Max(max) => Some(*max),
            _ => None,
        }
    }

    pub async fn min(&self) -> Option<u32> {
        match &self.range {
            Range::Min(min) => Some(*min),
            _ => None,
        }
    }
}

pub struct PaginationError(RangeError);

#[Object]
impl PaginationError {
    pub async fn description(&self) -> &'static str {
        "Pagination parameter out of range"
    }

    pub async fn range_error(&self) -> &RangeError {
        &self.0
    }
}

pub struct RecordNotFound;
#[Object]
impl RecordNotFound {
    pub async fn description(&self) -> &'static str {
        "Record does not exist"
    }
}

pub struct RecordAlreadyExist;
#[Object]
impl RecordAlreadyExist {
    pub async fn description(&self) -> &'static str {
        "Record already exists"
    }
}

// Common Mutation Errors
#[derive(Enum, Copy, Clone, PartialEq, Eq)]
#[graphql(rename_items = "camelCase")]
pub enum ForeignKey {
    OtherPartyId,
    ItemId,
    InvoiceId,
    StockLineId,
    LocationId,
    RequisitionId,
}

pub struct ForeignKeyError(pub ForeignKey);
#[Object]
impl ForeignKeyError {
    pub async fn description(&self) -> &'static str {
        "FK record doesn't exist"
    }

    pub async fn key(&self) -> ForeignKey {
        self.0
    }
}

#[derive(Enum, Copy, Clone, PartialEq, Eq)]
#[graphql(rename_items = "camelCase")]
pub enum UniqueValueKey {
    Code,
    DisplayName,
}

pub struct UniqueValueViolation(pub UniqueValueKey);
#[Object]
impl UniqueValueViolation {
    pub async fn description(&self) -> &'static str {
        "Field needs to be unique"
    }

    pub async fn field(&self) -> UniqueValueKey {
        self.0
    }
}

use repository::{
    EqualFilter, PaginationOption, UserAccountFilter, UserAccountRepository, UserAccountSort,
};
use util::i64_to_u32;

use crate::{
    get_default_pagination, service_provider::ServiceContext, ListError, ListResult,
    SingleRecordError,
};

use super::UserAccount;

pub const MAX_LIMIT: u32 = 1000;
pub const MIN_LIMIT: u32 = 1;

pub fn get_user_accounts(
    ctx: &ServiceContext,
    pagination: Option<PaginationOption>,
    filter: Option<UserAccountFilter>,
    sort: Option<UserAccountSort>,
) -> Result<ListResult<UserAccount>, ListError> {
    let pagination = get_default_pagination(pagination, MAX_LIMIT, MIN_LIMIT)?;
    let repository = UserAccountRepository::new(&ctx.connection);

    Ok(ListResult {
        rows: repository.query(pagination, filter.clone(), sort)?,
        count: i64_to_u32(repository.count(filter)?),
    })
}

pub fn get_user_account(
    ctx: &ServiceContext,
    id: String,
) -> Result<UserAccount, SingleRecordError> {
    let repository = UserAccountRepository::new(&ctx.connection);

    let mut result =
        repository.query_by_filter(UserAccountFilter::new().id(EqualFilter::equal_to(&id)))?;

    if let Some(record) = result.pop() {
        Ok(record)
    } else {
        Err(SingleRecordError::NotFound(id))
    }
}

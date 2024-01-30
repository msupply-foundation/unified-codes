use super::{
    user_account_row::{user_account, user_account::dsl as user_dsl},
    DBType, StorageConnection, UserAccountRow,
};
use crate::{
    diesel_macros::{apply_equal_filter, apply_sort_no_case, apply_string_filter},
    repository_error::RepositoryError,
    EqualFilter, Pagination, Sort, StringFilter,
};

use diesel::{dsl::IntoBoxed, prelude::*};

pub type UserAccount = UserAccountRow;

#[derive(Clone, Default, Debug, PartialEq)]
pub struct UserAccountFilter {
    pub id: Option<EqualFilter<String>>,
    pub username: Option<StringFilter>,
    pub display_name: Option<StringFilter>,
    pub search: Option<String>,
}

#[derive(PartialEq, Debug)]
pub enum UserAccountSortField {
    Username,
    DisplayName,
}

pub type UserAccountSort = Sort<UserAccountSortField>;

pub struct UserAccountRepository<'a> {
    connection: &'a StorageConnection,
}

impl<'a> UserAccountRepository<'a> {
    pub fn new(connection: &'a StorageConnection) -> Self {
        UserAccountRepository { connection }
    }

    pub fn count(&self, filter: Option<UserAccountFilter>) -> Result<i64, RepositoryError> {
        let query = create_filtered_query(filter);

        Ok(query.count().get_result(&self.connection.connection)?)
    }

    pub fn query_by_filter(
        &self,
        filter: UserAccountFilter,
    ) -> Result<Vec<UserAccount>, RepositoryError> {
        self.query(Pagination::new(), Some(filter), None)
    }

    pub fn query_one(
        &self,
        filter: UserAccountFilter,
    ) -> Result<Option<UserAccount>, RepositoryError> {
        Ok(self.query_by_filter(filter)?.pop())
    }

    pub fn query(
        &self,
        pagination: Pagination,
        filter: Option<UserAccountFilter>,
        sort: Option<UserAccountSort>,
    ) -> Result<Vec<UserAccount>, RepositoryError> {
        let mut query = create_filtered_query(filter);

        if let Some(sort) = sort {
            match sort.key {
                UserAccountSortField::Username => {
                    apply_sort_no_case!(query, sort, user_dsl::username);
                }
                UserAccountSortField::DisplayName => {
                    apply_sort_no_case!(query, sort, user_dsl::display_name);
                }
            }
        } else {
            query = query.order(user_dsl::id.asc())
        }

        let final_query = query
            .offset(pagination.offset as i64)
            .limit(pagination.limit as i64);

        // // Debug diesel query
        // println!(
        //     "{}",
        //     diesel::debug_query::<DBType, _>(&final_query).to_string()
        // );

        let result = final_query.load::<UserAccount>(&self.connection.connection)?;
        Ok(result)
    }
}

type BoxedUserQuery = IntoBoxed<'static, user_account::table, DBType>;

fn create_filtered_query(filter: Option<UserAccountFilter>) -> BoxedUserQuery {
    let mut query = user_dsl::user_account.into_boxed();

    if let Some(f) = filter {
        let UserAccountFilter {
            id,
            username,
            display_name,
            search,
        } = f;

        apply_equal_filter!(query, id, user_dsl::id);
        apply_string_filter!(query, username, user_dsl::username);
        apply_string_filter!(query, display_name, user_dsl::display_name);

        if let Some(search) = search {
            let search_term = format!("%{}%", search);
            query = query.filter(
                user_dsl::display_name
                    .like(search_term.clone())
                    .or(user_dsl::username.like(search_term)),
            );
        }
    }

    query
}

impl UserAccountFilter {
    pub fn new() -> UserAccountFilter {
        UserAccountFilter::default()
    }

    pub fn id(mut self, filter: EqualFilter<String>) -> Self {
        self.id = Some(filter);
        self
    }
    pub fn username(mut self, filter: StringFilter) -> Self {
        self.username = Some(filter);
        self
    }
    pub fn display_name(mut self, filter: StringFilter) -> Self {
        self.display_name = Some(filter);
        self
    }
}

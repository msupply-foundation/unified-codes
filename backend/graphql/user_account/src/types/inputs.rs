use async_graphql::{Enum, InputObject};
use graphql_core::generic_filters::{EqualFilterStringInput, SimpleStringFilterInput};
use repository::{
    EqualFilter, StringFilter, UserAccountFilter, UserAccountSort, UserAccountSortField,
};

#[derive(Enum, Copy, Clone, PartialEq, Eq)]
#[graphql(rename_items = "camelCase")]
pub enum UserAccountSortFieldInput {
    Username,
    DisplayName,
}

#[derive(InputObject)]
pub struct UserAccountSortInput {
    /// Sort query result by `key`
    key: UserAccountSortFieldInput,
    /// Sort query result is sorted descending or ascending (if not provided the default is
    /// ascending)
    desc: Option<bool>,
}
impl UserAccountSortInput {
    pub fn to_domain(self) -> UserAccountSort {
        use UserAccountSortField as to;
        use UserAccountSortFieldInput as from;
        let key = match self.key {
            from::Username => to::Username,
            from::DisplayName => to::DisplayName,
        };

        UserAccountSort {
            key,
            desc: self.desc,
        }
    }
}

#[derive(Clone, InputObject)]
pub struct UserAccountFilterInput {
    pub id: Option<EqualFilterStringInput>,
    pub username: Option<SimpleStringFilterInput>,
    pub display_name: Option<SimpleStringFilterInput>,
    pub search: Option<String>,
}

impl From<UserAccountFilterInput> for UserAccountFilter {
    fn from(f: UserAccountFilterInput) -> Self {
        UserAccountFilter {
            username: f.username.map(StringFilter::from),
            display_name: f.display_name.map(StringFilter::from),
            id: f.id.map(EqualFilter::from),
            search: f.search,
        }
    }
}

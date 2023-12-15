use std::ops::Index;

mod user_account;
pub use user_account::*;
mod user_permissions;
pub use user_permissions::*;

use crate::{
    UserAccountRow, UserAccountRowRepository, UserPermissionRow, UserPermissionRowRepository,
};

use super::StorageConnection;

#[derive(Default, Clone)]
pub struct MockData {
    pub user_accounts: Vec<UserAccountRow>,
    pub permissions: Vec<UserPermissionRow>,
}

#[derive(Default)]
pub struct MockDataInserts {
    pub user_accounts: bool,
    pub permissions: bool,
}

impl MockDataInserts {
    pub fn all() -> Self {
        MockDataInserts {
            user_accounts: true,
            permissions: true,
        }
    }

    pub fn none() -> Self {
        MockDataInserts::default()
    }

    pub fn user_accounts(mut self) -> Self {
        self.user_accounts = true;
        self
    }

    pub fn permissions(mut self) -> Self {
        self.user_accounts = true; // Permissions require user accounts
        self.permissions = true;
        self
    }
}

#[derive(Default)]
pub struct MockDataCollection {
    // Note: can't use a HashMap since mock data should be inserted in order
    pub data: Vec<(String, MockData)>,
}

impl MockDataCollection {
    pub fn insert(&mut self, name: &str, data: MockData) {
        self.data.push((name.to_string(), data));
    }

    pub fn get_mut(&mut self, name: &str) -> &mut MockData {
        for (n, data) in &mut self.data {
            if n != name {
                continue;
            }
            return data;
        }
        unreachable!("Missing mock data");
    }
}

impl Index<&str> for MockDataCollection {
    type Output = MockData;

    fn index(&self, name: &str) -> &Self::Output {
        &self.data.iter().find(|entry| entry.0 == name).unwrap().1
    }
}

fn all_mock_data() -> MockDataCollection {
    let mut data: MockDataCollection = Default::default();
    data.insert(
        "base",
        MockData {
            user_accounts: mock_user_accounts(),
            permissions: mock_permissions(),
        },
    );
    data
}

pub async fn insert_all_mock_data(
    connection: &StorageConnection,
    inserts: MockDataInserts,
) -> MockDataCollection {
    insert_mock_data(connection, inserts, all_mock_data()).await
}

pub async fn insert_mock_data(
    connection: &StorageConnection,
    inserts: MockDataInserts,
    mock_data: MockDataCollection,
) -> MockDataCollection {
    for (_, mock_data) in &mock_data.data {
        if inserts.user_accounts {
            let repo = UserAccountRowRepository::new(connection);
            for row in &mock_data.user_accounts {
                repo.insert_one(row).unwrap();
            }
        }
        if inserts.permissions {
            let repo = UserPermissionRowRepository::new(connection);
            for row in &mock_data.permissions {
                repo.insert_one(row).unwrap();
            }
        }
    }

    mock_data
}

impl MockData {
    pub fn join(mut self, other: MockData) -> MockData {
        let MockData {
            mut user_accounts,
            mut permissions,
        } = other;

        self.user_accounts.append(&mut user_accounts);
        self.permissions.append(&mut permissions);

        self
    }
}

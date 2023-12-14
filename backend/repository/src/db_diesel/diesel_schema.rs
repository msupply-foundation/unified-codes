use super::audit_log_row::audit_log;
use super::email_queue_row::email_queue;

use super::key_value_store::key_value_store;

use super::user_account_row::user_account;
use super::user_permission_row::user_permission;

allow_tables_to_appear_in_same_query!(
    email_queue,
    key_value_store,
    audit_log,
    user_account,
    user_permission,
);

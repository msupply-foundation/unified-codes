CREATE TABLE
    user_permission (
        id TEXT NOT NULL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES user_account(id),
        permission TEXT NOT NULL
    );

CREATE UNIQUE INDEX ux_user_permission
ON user_permission(user_id, permission);
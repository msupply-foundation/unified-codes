CREATE TABLE
    user_account (
        id TEXT NOT NULL PRIMARY KEY,
        username TEXT NOT NULL,
        display_name TEXT NOT NULL,
        email TEXT,
        -- Hashed password
        hashed_password TEXT NOT NULL,
        password_reset_token TEXT,
        password_reset_datetime TIMESTAMP
    );

CREATE UNIQUE INDEX ux_user_account_username ON user_account (username);

-- Indexes for performance if we ever have a large number of useraccounts
CREATE INDEX IF NOT EXISTS ix_password_reset_token ON user_account (password_reset_token);

CREATE INDEX IF NOT EXISTS ix_user_account_email ON user_account (email);
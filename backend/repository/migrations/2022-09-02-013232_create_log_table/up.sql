CREATE TABLE
    audit_log (
        id TEXT NOT NULL PRIMARY KEY,
        record_type TEXT NOT NULL,
        user_id TEXT,
        record_id TEXT,
        datetime TIMESTAMP NOT NULL
    );
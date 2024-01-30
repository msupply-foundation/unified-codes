-- Your SQL goes here
CREATE TABLE email_queue (
    id TEXT PRIMARY KEY,
    to_address TEXT NOT NULL,
    subject TEXT NOT NULL,
    html_body TEXT NOT NULL,
    text_body TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    sent_at TIMESTAMP,
    retries INTEGER NOT NULL DEFAULT 0,
    error TEXT
);

CREATE INDEX email_queue_status ON email_queue (status);
CREATE INDEX email_queue_retries ON email_queue (retries);
CREATE INDEX email_queue_created_at ON email_queue (created_at);
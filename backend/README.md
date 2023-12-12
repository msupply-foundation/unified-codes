# Notify Backend

This is the backend for `Universal Codes`.
It is written in Rust and communicates with the frontend via GraphQL.
The backend datastores are dGraph and sqlite.

## Exploring GraphQL Api

When served locally, visit: http://localhost:8001/graphql

You can also tools such as GraphiQL (use the same URL as above): https://graphiql-online.com/

## Tests

- To run all standard tests:

```bash
cargo test
```

- To run email tests:
  Start mailhog (or similar email capture service).
  For install instructions visit: https://github.com/mailhog/MailHog

```
cargo test --features=email-tests --package service --lib -- email::email_test --nocapture
```

## Email

By default Notify will send emails via a local SMTP server on port 1025.
To change this to your own server, update the `configuration/local.yaml` file with your own settings.

```
mail:
  host: "YOUR_SMTP_SERVER"
  port: "YOUR_SMTP_PORT"
  starttls: true
  username: "YOUR_SMTP_USERNAME"
  password: "YOUR_SMTP_PASSWORD"
  from: "YOUR EMAIL ADDRESS"
```

## SSL/https

This application is designed to run behind a SSL proxy such as [Caddy](https://caddyserver.com) or Nginx, so doesn't provide SSL support itself.

> WARNING: DO NOT RUN THIS IN PRODUCTION WITHOUT SSL!

# Logging

By default, the server logs to console with a logging level of `Info`
You can configure this, to log to a file, for example, with a rollover of log files based on file size.
See the `example.yaml` file for the available options.

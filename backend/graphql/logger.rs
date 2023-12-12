use std::fmt::Write;
use std::sync::Arc;

use util::filters::replace_passwords;

use async_graphql::extensions::{
    Extension, ExtensionContext, ExtensionFactory, NextExecute, NextParseQuery,
};
use async_graphql::parser::types::{ExecutableDocument, OperationType, Selection};
use async_graphql::{PathSegment, Response, ServerResult, Variables};

pub struct ResponseLogger;
impl ExtensionFactory for ResponseLogger {
    fn create(&self) -> Arc<dyn Extension> {
        Arc::new(ResponseLoggerExtension)
    }
}
struct ResponseLoggerExtension;
#[async_trait::async_trait]
impl Extension for ResponseLoggerExtension {
    async fn execute(
        &self,
        ctx: &ExtensionContext<'_>,
        operation_name: Option<&str>,
        next: NextExecute<'_>,
    ) -> async_graphql::Response {
        let resp = next.run(ctx, operation_name).await;
        log::info!(
            target: "async-graphql",
            "[Execute Response] {:?} - response_length: {}", operation_name.unwrap_or_default(), format!("{:?}", resp).len()
        );
        resp
    }
}

/*
   This Request Logger Implementation is adapted from the async_graphql::extensions::RequestLogger
   https://github.com/async-graphql/async-graphql/blob/master/src/extensions/logger.rs
   MIT & Apache License (Version 2.0)

   This version
   * redacts passwords from request logging
   * Prints extended message information for improved debugging

  Changes for original code are marked with a comment starting with // UPDATED:
*/

pub struct RequestLogger;

impl ExtensionFactory for RequestLogger {
    fn create(&self) -> Arc<dyn Extension> {
        Arc::new(RequestLoggerExtension)
    }
}

struct RequestLoggerExtension;

#[async_trait::async_trait]
impl Extension for RequestLoggerExtension {
    async fn parse_query(
        &self,
        ctx: &ExtensionContext<'_>,
        query: &str,
        variables: &Variables,
        next: NextParseQuery<'_>,
    ) -> ServerResult<ExecutableDocument> {
        let document = next.run(ctx, query, variables).await?;
        let is_schema = document
            .operations
            .iter()
            .filter(|(_, operation)| operation.node.ty == OperationType::Query)
            .any(|(_, operation)| operation.node.selection_set.node.items.iter().any(|selection| matches!(&selection.node, Selection::Field(field) if field.node.name.node == "__schema")));
        if !is_schema {
            let graphql_query_string = ctx.stringify_execute_doc(&document, variables);

            // UPDATED: filter out passwords
            let graphql_query_string = replace_passwords(graphql_query_string);

            log::info!(
                target: "async-graphql",
                "[Execute] {}", graphql_query_string
            );
        }
        Ok(document)
    }

    async fn execute(
        &self,
        ctx: &ExtensionContext<'_>,
        operation_name: Option<&str>,
        next: NextExecute<'_>,
    ) -> Response {
        let resp = next.run(ctx, operation_name).await;
        if resp.is_err() {
            for err in &resp.errors {
                if !err.path.is_empty() {
                    let mut path = String::new();
                    for (idx, s) in err.path.iter().enumerate() {
                        if idx > 0 {
                            path.push('.');
                        }
                        match s {
                            PathSegment::Index(idx) => {
                                let _ = write!(&mut path, "{}", idx);
                            }
                            PathSegment::Field(name) => {
                                let _ = write!(&mut path, "{}", name);
                            }
                        }
                    }

                    // UPDATED: add err.extensions
                    log::info!(
                        target: "async-graphql",
                        "[Error] path={} message={} ext={:?}", path, err.message, err.extensions
                    );
                } else {
                    // UPDATED: add err.extensions
                    log::info!(
                        target: "async-graphql",
                        "[Error] message={} ext={:?}", err.message, err.extensions
                    );
                }
            }
        }
        resp
    }
}

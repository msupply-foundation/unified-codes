mod mutations;
use self::mutations::*;
mod types;
use self::types::*;

use async_graphql::*;
use graphql_core::standard_graphql_error::validate_auth;
use graphql_core::ContextExt;
use service::auth::Resource;
use service::auth::ResourceAccessRequest;

#[derive(Default, Clone)]
pub struct ConfigurationQueries;

#[Object]
impl ConfigurationQueries {
    /// Get the configuration items for a given type.
    pub async fn configuration_items(
        &self,
        ctx: &Context<'_>,
        r#type: ConfigurationItemTypeInput,
    ) -> Result<ConfigurationItemsResponse> {
        let user = validate_auth(
            ctx,
            &ResourceAccessRequest {
                resource: Resource::MutateUniversalCodes,
            },
        )?;

        let service_context = ctx.service_context(Some(&user))?;

        let result = service_context
            .service_provider
            .configuration_service
            .configuration_items(r#type.to_domain())
            .await?;

        Ok(ConfigurationItemsResponse::Response(
            ConfigurationItemConnector::from_domain(result),
        ))
    }

    /// Get the property configuration items
    pub async fn property_configuration_items(
        &self,
        ctx: &Context<'_>,
    ) -> Result<PropertyConfigurationItemsResponse> {
        let result = ctx
            .service_provider()
            .configuration_service
            .property_configuration_items()
            .await?;

        Ok(PropertyConfigurationItemsResponse::Response(
            PropertyConfigurationItemConnector::from_domain(result),
        ))
    }
}

#[derive(Default, Clone)]
pub struct ConfigurationMutations;

#[Object]
impl ConfigurationMutations {
    async fn add_configuration_item(
        &self,
        ctx: &Context<'_>,
        input: AddConfigurationItemInput,
    ) -> Result<u32> {
        add_configuration_item(ctx, input).await
    }

    async fn upsert_property_configuration_item(
        &self,
        ctx: &Context<'_>,
        input: UpsertPropertyConfigItemInput,
    ) -> Result<u32> {
        upsert_property_configuration_item(ctx, input).await
    }

    async fn delete_configuration_item(&self, ctx: &Context<'_>, code: String) -> Result<u32> {
        delete_configuration_item(ctx, code).await
    }
}

use std::collections::HashMap;

use repository::{
    EqualFilter, Permission, RepositoryError, UserPermissionFilter, UserPermissionRepository,
    UserPermissionRow,
};

use crate::{auth_data::AuthenticationContext, service_provider::ServiceContext};

#[derive(Debug, Clone)]
pub enum PermissionDSL {
    HasPermission(Permission),
    NoPermissionRequired,
    And(Vec<PermissionDSL>),
    Any(Vec<PermissionDSL>),
}

/// Resources for permission checks
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum Resource {
    Authenticated,
    RouteMe,
    MutateUsers,
    ServerAdmin,
    QueryLog,
    QueryUsers,
}

fn all_permissions() -> HashMap<Resource, PermissionDSL> {
    let mut map = HashMap::new();
    // For use when user needs to be logged in, but access is controlled or limited else where in service layer.
    map.insert(Resource::Authenticated, PermissionDSL::NoPermissionRequired);
    // me: No permission needed
    map.insert(Resource::RouteMe, PermissionDSL::NoPermissionRequired);
    map.insert(
        Resource::ServerAdmin,
        PermissionDSL::HasPermission(Permission::ServerAdmin),
    );
    map.insert(
        Resource::QueryLog,
        PermissionDSL::HasPermission(Permission::ServerAdmin),
    );

    map.insert(
        Resource::MutateUsers,
        PermissionDSL::Any(vec![PermissionDSL::HasPermission(Permission::ServerAdmin)]),
    );

    map.insert(
        Resource::QueryUsers,
        PermissionDSL::Any(vec![PermissionDSL::HasPermission(Permission::ServerAdmin)]),
    );

    map
}

#[derive(Debug)]
pub enum AuthorisationDeniedKind {
    NotAuthenticated(String),
    InsufficientPermission {
        msg: String,
        required_permissions: PermissionDSL,
    },
}

#[derive(Debug)]
pub enum AuthorisationError {
    Denied(AuthorisationDeniedKind),
    InternalError(String),
}

pub struct ValidatedUser {
    pub user_id: String,
}

/// Information about the resource a user wants to access
#[derive(Debug, Clone)]
pub struct ResourceAccessRequest {
    pub resource: Resource,
}

fn validate_resource_permissions(
    user_id: &str,
    user_permissions: &[UserPermissionRow],
    resource_request: &ResourceAccessRequest,
    resource_permission: &PermissionDSL,
) -> Result<(), String> {
    // println!(
    //     "validate_resource_permissions() user {:?} required {:?}",
    //     user_permissions, resource_permission
    // );
    match resource_permission {
        PermissionDSL::HasPermission(permission) => {
            if user_permissions.iter().any(|p| &p.permission == permission) {
                return Ok(());
            }
            return Err(format!("Missing permission: {:?}", permission));
        }
        PermissionDSL::NoPermissionRequired => {
            return Ok(());
        }
        PermissionDSL::And(children) => {
            for child in children {
                if let Err(err) = validate_resource_permissions(
                    user_id,
                    user_permissions,
                    resource_request,
                    child,
                ) {
                    return Err(err);
                }
            }
        }
        PermissionDSL::Any(children) => {
            for child in children {
                if validate_resource_permissions(user_id, user_permissions, resource_request, child)
                    .is_ok()
                {
                    return Ok(());
                }
            }
            return Err(format!("No permissions for any of: {:?}", children));
        }
    };
    Ok(())
}

pub trait AuthServiceTrait: Send + Sync {
    fn validate(
        &self,
        ctx: &ServiceContext,
        authentication_context: &AuthenticationContext,
        resource_request: &ResourceAccessRequest,
    ) -> Result<ValidatedUser, AuthorisationError>;
}

pub struct AuthService {
    pub resource_permissions: HashMap<Resource, PermissionDSL>,
}

impl AuthService {
    pub fn new() -> Self {
        AuthService {
            resource_permissions: all_permissions(),
        }
    }
}

impl Default for AuthService {
    fn default() -> Self {
        Self::new()
    }
}

impl AuthServiceTrait for AuthService {
    fn validate(
        &self,
        context: &ServiceContext,
        authentication_context: &AuthenticationContext,
        resource_request: &ResourceAccessRequest,
    ) -> Result<ValidatedUser, AuthorisationError> {
        let connection = &context.connection;
        let permission_filter = UserPermissionFilter::new()
            .user_id(EqualFilter::equal_to(&authentication_context.user_id));

        let user_permission =
            UserPermissionRepository::new(connection).query_by_filter(permission_filter)?;

        let required_permissions = match self.resource_permissions.get(&resource_request.resource) {
            Some(required_permissions) => required_permissions,
            None => {
                //The requested resource doesn't have a permission mapping assigned (server error)
                return Err(AuthorisationError::InternalError(format!(
                    "Unable to identify required permissions for resource {:?}",
                    &resource_request.resource
                )));
            }
        };
        match validate_resource_permissions(
            &authentication_context.user_id,
            &user_permission,
            resource_request,
            required_permissions,
        ) {
            Ok(_) => {}
            Err(msg) => {
                return Err(AuthorisationError::Denied(
                    AuthorisationDeniedKind::InsufficientPermission {
                        msg,
                        required_permissions: required_permissions.clone(),
                    },
                ));
            }
        };

        Ok(ValidatedUser {
            user_id: authentication_context.user_id.to_owned(),
        })
    }
}

impl From<RepositoryError> for AuthorisationError {
    fn from(error: RepositoryError) -> Self {
        AuthorisationError::InternalError(format!("{:#?}", error))
    }
}

#[cfg(test)]
mod validate_resource_permissions_test {
    use repository::{Permission, UserPermissionRow};

    use super::{validate_resource_permissions, PermissionDSL, Resource, ResourceAccessRequest};

    #[actix_rt::test]
    async fn test_validate_resource_permissions() {
        let user_id = "test_user_id";

        let user_permissions: Vec<UserPermissionRow> = vec![];
        let resource_request = ResourceAccessRequest {
            resource: Resource::ServerAdmin,
        };
        let required_permissions = PermissionDSL::HasPermission(Permission::ServerAdmin);

        //Ensure validation fails if user has no permissions
        let validation_result = validate_resource_permissions(
            user_id,
            &user_permissions,
            &resource_request,
            &required_permissions,
        );
        assert!(validation_result.is_err());

        //Ensure validation succeeds if user has single required permission
        let user_permissions: Vec<UserPermissionRow> = vec![UserPermissionRow {
            id: "dummy_id".to_string(),
            user_id: user_id.to_string(),
            permission: Permission::ServerAdmin,
        }];
        let validation_result = validate_resource_permissions(
            user_id,
            &user_permissions,
            &resource_request,
            &required_permissions,
        );
        assert!(validation_result.is_ok());

        //Test DSL user has 1 out of any 1 permission - any(1 perm)
        let required_permissions =
            PermissionDSL::Any(vec![PermissionDSL::HasPermission(Permission::ServerAdmin)]);
        let validation_result = validate_resource_permissions(
            user_id,
            &user_permissions,
            &resource_request,
            &required_permissions,
        );
        assert!(validation_result.is_ok());

        //Test DSL user has 1 out of any 2 permissions - any(2 perm)
        let required_permissions = PermissionDSL::Any(vec![
            PermissionDSL::HasPermission(Permission::ServerAdmin),
            PermissionDSL::HasPermission(Permission::Reader),
        ]);
        let validation_result = validate_resource_permissions(
            user_id,
            &user_permissions,
            &resource_request,
            &required_permissions,
        );
        assert!(validation_result.is_ok());

        //Test DSL user has 0 out of any 1 permission - any(1 perm)
        let required_permissions =
            PermissionDSL::Any(vec![PermissionDSL::HasPermission(Permission::Reader)]);
        let validation_result = validate_resource_permissions(
            user_id,
            &user_permissions,
            &resource_request,
            &required_permissions,
        );
        assert!(validation_result.is_err());

        //Test DSL user has 1 out of 2 required permission - And(2 perm)
        let user_permissions: Vec<UserPermissionRow> = vec![UserPermissionRow {
            id: "dummy_id2".to_string(),
            user_id: user_id.to_string(),
            permission: Permission::Reader,
        }];
        let required_permissions = PermissionDSL::And(vec![
            PermissionDSL::HasPermission(Permission::ServerAdmin),
            PermissionDSL::HasPermission(Permission::Reader),
        ]);
        let validation_result = validate_resource_permissions(
            user_id,
            &user_permissions,
            &resource_request,
            &required_permissions,
        );
        assert!(validation_result.is_err());

        //Test DSL user has 2 out of 2 required permission - And(2 perm)
        let user_permissions: Vec<UserPermissionRow> = vec![
            UserPermissionRow {
                id: "dummy_id1".to_string(),
                user_id: user_id.to_string(),
                permission: Permission::ServerAdmin,
            },
            UserPermissionRow {
                id: "dummy_id2".to_string(),
                user_id: user_id.to_string(),
                permission: Permission::Reader,
            },
        ];
        let required_permissions = PermissionDSL::And(vec![
            PermissionDSL::HasPermission(Permission::ServerAdmin),
            PermissionDSL::HasPermission(Permission::Reader),
        ]);
        let validation_result = validate_resource_permissions(
            user_id,
            &user_permissions,
            &resource_request,
            &required_permissions,
        );
        assert!(validation_result.is_ok());

        // NOTE: THESE TEST CASES REQUIRES MORE THAN 2 ROLES - Which we don't currently have...

        // //Test DSL user has Any(1,And(1,2))

        // let required_permissions = PermissionDSL::Any(vec![
        //     PermissionDSL::HasPermission(Permission::ServerAdmin),
        //     PermissionDSL::And(vec![PermissionDSL::HasPermission(Permission::Reader)]),
        // ]);
        // let user_permissions: Vec<UserPermissionRow> = vec![UserPermissionRow {
        //     id: "dummy_id2".to_string(),
        //     user_id: user_id.to_string(),
        //     permission: Permission::Reader,
        // }];
        // let validation_result = validate_resource_permissions(
        //     user_id,
        //     &user_permissions,
        //     &resource_request,
        //     &required_permissions,
        // );
        // assert!(validation_result.is_ok());

        // let required_permissions = PermissionDSL::Any(vec![
        //     PermissionDSL::HasPermission(Permission::ServerAdmin),
        //     PermissionDSL::And(vec![PermissionDSL::HasPermission(Permission::Reader)]),
        // ]);
        // let user_permissions: Vec<UserPermissionRow> = vec![UserPermissionRow {
        //     id: "dummy_id2".to_string(),
        //     user_id: user_id.to_string(),
        //     permission: Permission::ServerAdmin,
        // }];
        // let validation_result = validate_resource_permissions(
        //     user_id,
        //     &user_permissions,
        //     &resource_request,
        //     &required_permissions,
        // );
        // assert!(validation_result.is_ok());

        // //Test DSL user has And(1,Any(1,2))
        // let required_permissions = PermissionDSL::And(vec![
        //     PermissionDSL::OrganisationFilterRequired,
        //     PermissionDSL::Any(vec![
        //         PermissionDSL::HasPermission(Permission::ServerAdmin),
        //         PermissionDSL::HasPermission(Permission::OrganisationAdmin),
        //     ]),
        // ]);
        // let user_permissions: Vec<UserPermissionRow> = vec![UserPermissionRow {
        //     id: "dummy_id2".to_string(),
        //     user_id: user_id.to_string(),
        //     permission: Permission::OrganisationAdmin,
        //     organisation_id: Some(organisation_id.to_string()),
        // }];
        // let validation_result = validate_resource_permissions(
        //     user_id,
        //     &user_permissions,
        //     &resource_request,
        //     &required_permissions,
        // );
        // assert!(validation_result.is_ok());

        // let user_permissions: Vec<UserPermissionRow> = vec![UserPermissionRow {
        //     id: "dummy_id2".to_string(),
        //     user_id: user_id.to_string(),
        //     permission: Permission::ServerAdmin,
        //     organisation_id: None,
        // }];
        // let validation_result = validate_resource_permissions(
        //     user_id,
        //     &user_permissions,
        //     &resource_request,
        //     &required_permissions,
        // );
        // assert!(validation_result.is_ok());
    }
}

#[cfg(test)]
mod permission_validation_test {
    use std::sync::Arc;

    use super::*;
    use crate::{service_provider::ServiceProvider, test_utils::get_test_settings};
    use repository::{
        mock::{mock_user_account_a, MockDataInserts},
        test_db::setup_all,
        Permission, UserPermissionRow, UserPermissionRowRepository,
    };
    use util::uuid::uuid;

    #[actix_rt::test]
    async fn test_basic_permission_validation() {
        let user_id = &mock_user_account_a().id;

        let auth_context = AuthenticationContext {
            user_id: user_id.to_string(),
        };

        let (_, _, connection_manager, _) = setup_all(
            "basic_permission_validation",
            MockDataInserts::none().user_accounts(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::new(service_provider).unwrap();
        let permission_repo = UserPermissionRowRepository::new(&context.connection);

        let mut service = AuthService::new();
        service.resource_permissions.clear();
        service.resource_permissions.insert(
            Resource::ServerAdmin,
            PermissionDSL::HasPermission(Permission::ServerAdmin),
        );

        // validate user doesn't has access when resource exists but has no permissions assigned
        assert!(service
            .validate(
                &context,
                &auth_context,
                &ResourceAccessRequest {
                    resource: Resource::QueryUsers,
                }
            )
            .is_err());

        // validate user still does have not access when resource permissions are correctly entered (but user has no permissions)
        service.resource_permissions.insert(
            Resource::QueryUsers,
            PermissionDSL::HasPermission(Permission::ServerAdmin),
        );
        assert!(service
            .validate(
                &context,
                &auth_context,
                &ResourceAccessRequest {
                    resource: Resource::QueryUsers
                }
            )
            .is_err());

        // validate user can't access resource with wrong permission
        permission_repo
            .insert_one(&UserPermissionRow {
                id: uuid(),
                user_id: user_id.to_string(),
                permission: Permission::Reader,
            })
            .unwrap();
        assert!(service
            .validate(
                &context,
                &auth_context,
                &ResourceAccessRequest {
                    resource: Resource::ServerAdmin,
                }
            )
            .is_err());

        permission_repo
            .insert_one(&UserPermissionRow {
                id: uuid(),
                user_id: user_id.to_string(),
                permission: Permission::ServerAdmin,
            })
            .unwrap();

        //validate the user_id is set in JWT Claim
        let validated_user = service
            .validate(
                &context,
                &auth_context,
                &ResourceAccessRequest {
                    resource: Resource::ServerAdmin,
                },
            )
            .unwrap();
        assert_eq!(validated_user.user_id, user_id.to_string());
    }
}

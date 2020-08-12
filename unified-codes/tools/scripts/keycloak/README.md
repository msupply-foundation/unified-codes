# Keycloak

Tools for setting up the unified codes [keycloak](https://www.keycloak.org/) service. 

## Getting started

1. Install docker [here](https://docs.docker.com/get-docker/).
2. Run standalone keycloak instance: `chmod +x ./run.sh && ./run.sh`.
3. Populate demo role, user and client data: `chmod +x ./setup.sh && ./setup.sh`.
4. Keycloak is now running, you can access at [http://localhost:9990](http://localhost:9990)

## Usage

[keycloak](https://www.keycloak.org/) is used by the unified codes data service for user identification and access control.

The demo script will get you up and running with a sample keycloak realm and client (default login is admin/admin).

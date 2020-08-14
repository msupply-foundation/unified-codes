# unified-codes auth-service

An implementation of [keycloak](https://www.keycloak.org/) for use as an authentication service providing open ID authentication to the unified codes application.

## Getting started

1. Install docker [here](https://docs.docker.com/get-docker/).
2. Run standalone keycloak instance: `./docker.sh`.
3. Keycloak is now running, you can access at [http://localhost:9990](http://localhost:9990)

## Usage

The script will get you up and running with a sample realm (unified-codes) and client (unified-codes-data). Default admin login is admin/admin.
Note: Prior to running the shell script you may have to allow execute permission: `chmod +x docker.sh`

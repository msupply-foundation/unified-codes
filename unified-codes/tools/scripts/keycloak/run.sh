#!/bin/bash

KEYCLOAK_PORT=9990

echo " * Launching keycloak container..."
docker run -p $KEYCLOAK_PORT:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin jboss/keycloak

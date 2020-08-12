#!/bin/bash

echo " * Launching keycloak container..."
docker run -p 9990:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin jboss/keycloak

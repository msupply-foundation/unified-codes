#!/bin/bash

# mac version of shell script
echo "* Starting service.."
open -a Terminal.app ./docker.sh

echo "* Waiting for 30s"
sleep 30

echo "* Request for authorization"
RESULT=`curl --data "username=admin&password=admin&grant_type=password&client_id=admin-cli" http://localhost:9990/auth/realms/master/protocol/openid-connect/token`

echo
echo "* Recovery of the token"
TOKEN=`echo $RESULT | sed 's/.*access_token":"//g' | sed 's/".*//g'`

echo
echo "* Display token"
echo $TOKEN

echo
echo " * realm creation"
curl -v http://localhost:9990/auth/admin/realms -H "Content-Type: application/json" -H "Authorization: bearer $TOKEN"   --data '{"enabled": true, "id": "unified-codes", "realm": "unified-codes"}'
echo

echo " * role creation"
curl -v http://localhost:9990/auth/admin/realms/unified-codes/roles -H "Content-Type: application/json" -H "Authorization: bearer $TOKEN"   --data '{"description": "Administation access", "name": "ADMIN" }'

echo
echo " * user creation"
curl -v http://localhost:9990/auth/admin/realms/unified-codes/clients -H "Content-Type: application/json" -H "Authorization: bearer $TOKEN"   --data '{"username": "demo-admin", "firstName":"Demo", "lastName":"Admin", "attributes": {}, "email":"demo-admin@msupply.foundation", "emailVerified": true, "enabled":"true", "credentials": [{"type": "password", "value": "pass", "temporary": false}], "realmRoles": ["ADMIN"] }'

echo
echo " * client creation"
curl -v http://localhost:9990/auth/admin/realms/unified-codes/users -H "Content-Type: application/json" -H "Authorization: bearer $TOKEN"   --data '"attributes": {}, "clientId": "unified-codes-data", "enabled": true, "protocol": "openid-connect", "redirectUris": [], "rootUrl": "http://localhost:4000"'

open "http://localhost:9990/auth/admin/master/console/#/realms/unified-codes"

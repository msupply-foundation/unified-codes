#!/bin/bash

echo " * Submitting admin credentials..."
RESULT=`curl --data "username=admin&password=admin&grant_type=password&client_id=admin-cli" http://localhost:9990/auth/realms/master/protocol/openid-connect/token`

echo
echo " * Recovered access token"
TOKEN=`echo $RESULT | sed 's/.*access_token":"//g' | sed 's/".*//g'`
echo $TOKEN

echo
echo " * Creating realm..."
curl -v http://localhost:9990/auth/admin/realms -H "Content-Type: application/json" -H "Authorization: bearer $TOKEN"   --data '{"enabled": true, "id": "unified-codes", "realm": "unified-codes"}'
echo

echo " * Creating role..."
curl -v http://localhost:9990/auth/admin/realms/unified-codes/roles -H "Content-Type: application/json" -H "Authorization: bearer $TOKEN"   --data '{"description": "Administation access", "name": "ADMIN" }'

echo
echo " * Creating user..."
curl -v http://localhost:9990/auth/admin/realms/unified-codes/users -H "Content-Type: application/json" -H "Authorization: bearer $TOKEN"   --data '{"username": "demo-admin", "firstName":"Demo", "lastName":"Admin", "attributes": {}, "email":"demo-admin@msupply.foundation", "emailVerified": true, "enabled":"true", "credentials": [{"type": "password", "value": "pass", "temporary": false}], "realmRoles": ["ADMIN"] }'

echo
echo " * Creating client..."
curl -v http://localhost:9990/auth/admin/realms/unified-codes/clients -H "Content-Type: application/json" -H "Authorization: bearer $TOKEN"   --data '{"clientId": "unified-codes-data", "enabled": true, "protocol": "openid-connect", "redirectUris": [], "rootUrl": "http://localhost:4200", "authorizationServicesEnabled": true, "bearerOnly": false, "clientAuthenticatorType": "client-secret", "publicClient": false, "serviceAccountsEnabled": true }'

echo " * Done."

open "http://localhost:9990/auth/admin/master/console/#/realms/unified-codes"

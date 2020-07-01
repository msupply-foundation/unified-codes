#!/usr/bin/env bash

curl -s -H "Content-Type: application/json" "localhost:8080/alter?commitNow=true" -XPOST --data-binary "{ \"drop_all\": true }" | python3 -m json.tool
#!/usr/bin/env bash

curl -s -H "Content-Type: application/json" "localhost:8080/mutate?commitNow=true" -XPOST --data-binary "@$1" | python3 -m json.tool
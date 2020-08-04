#!/usr/bin/env bash

curl -s -H "Content-Type: application/graphql+-" "localhost:8080/query" -XPOST --data-binary "@$1" | python3 -m json.tool
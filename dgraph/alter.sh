#!/usr/bin/env bash

curl -s -H "Content-Type: application/graphql" "localhost:8080/admin/schema" -XPOST --data-binary "@$1"
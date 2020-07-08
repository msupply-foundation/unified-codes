#!/usr/bin/env bash

curl -s -H "Content-Type: application/json" "localhost:8080/graphql" -XPOST -d "@$1"
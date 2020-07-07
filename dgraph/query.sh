#!/usr/bin/env bash

curl -s -H "Content-Type: application/graphql" "localhost:8080/graphql" -XPOST --data-binary "@$1"
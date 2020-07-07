#!/usr/bin/env bash

curl -X POST localhost:8080/admin/schema --data-binary "@$1"
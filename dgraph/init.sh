#!/usr/bin/env bash

./clean.sh
./alter.sh ./sample/schema.gql
./query.sh ./sample/insert.json
#!/usr/bin/env bash

./clean.sh
./alter.sh ./sample/schema.gql
./mutate.sh ./sample/data.json
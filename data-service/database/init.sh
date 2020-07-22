#!/usr/bin/env bash

./clean.sh
./alter.sh ./data/schema.gql
./mutate.sh ./data/demo.json
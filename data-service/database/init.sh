#!/usr/bin/env bash

bash ./clean.sh
bash ./alter.sh ./data/schema.gql
bash ./mutate.sh ./data/demo.json
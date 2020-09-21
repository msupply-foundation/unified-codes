#!/usr/bin/env bash

echo " * Deleting existing graph data..."
bash ./clean.sh

echo " * Initialising demo graph schema..."
bash ./alter.sh ./data/schema.gql

echo " * Populating demo graph data..."
bash ./mutate.sh ./data/import.json

echo " * Done."
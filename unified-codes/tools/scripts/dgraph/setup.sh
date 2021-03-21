#!/usr/bin/env bash

echo " * Deleting existing graph data..."
bash ./clean.sh

echo " * Initialising demo graph schema..."
bash ./alter.sh ./data/v2/schema.gql

echo " * Populating demo graph data..."
cd ../../../
npx nx serve data-parser
cd -

echo " * Done."
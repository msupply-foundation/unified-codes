# unified-codes : data migration

A dump of the v1 data is in `data/items.json`.
In the root is a node script which will parse and transform to a dgraph format, ready for input.

## Usage

Run the migration script `node migrate.js [source] [output]`
e.g. `node migrate.js ./data/items.json ./data/data.v2.json`


### Add/update data

You can use the project in the `dgraph` folder to clean and import the results
```
../dgraph/clean.sh
../dgraph/mutate.sh ./data/data.v2.json
```

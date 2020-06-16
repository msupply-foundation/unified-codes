# unified-codes

## Getting started

1. Install docker [here](https://docs.docker.com/get-docker/).
2. Run standalone dgraph instance: `dgraph/docker.sh`.
3. Dgraph is now running, you can access Ratel at http://localhost:8000.

## Usage

### Update graph schema

```
./alter.sh ./schema.gql
```

### Add/update data

```
./mutate.sh ./data.json
```

### Query graph

```
./query.sh ./query.gql
```

## Examples

### Schema

```
# schema.gql

type Entity {
  code
  description
  type
  has_property
  has_child
}

type Property {
  type
  value
}

code: string .
description: string .
type: string .
value: string .
has_property: [uid] .
has_child: [uid]
```

### Data

```
# data.json

{
    "set": [
        {
            "code": "QFWR9789",
            "description": "Amoxicillin",
            "type": "medicinal_product",
            "has_property": {
                "type": "atc_code",
                "value": "J01CA04"
            },
            "has_child": {
                "description": "Amoxicillin Oral Dose Forms",
                "type": "medicinal_product_dose_form",
                "has_property": {
                    "type": "snowmed_code",
                    "value": "350162003"
                },
                "has_child": {
                    "code": "368C7BF"
                    "description": "Amoxicillin 250mg Capsules",
                    "has_property": [...]
                    "has_child": [...]
                }
            }
        }
    ]
}
```

### Query

```
# query.gql

{
    amoxicillin(func: eq(description, "Amoxicillin"))  {
        code
        has_property {
            type
            value
        }
    }
}
```
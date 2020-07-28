## GraphQL API

We expose a GraphQL API for universal drug codes using [Apollo Server](https://github.com/apollographql/apollo-server#readme). 

### Query Details
* **Endpoint:** `{GraphQLHost}/graphql`
* **Headers:** `Content-Type: application/json`
* **Body:** ``{
	"query": [GRAPHQL_QUERY]
	"operationName": [OPERATION_NAME] 
}``


### Tips on Querying
When building queries/testing against this API it is recommended to use a GraphQL client that does schema introspection (e.g. Insomnia/GraphiQL) for schema visibility and syntax highlighting/correction.

As these are all GraphQL requests, you may specify as many or as few properties (per the schema) as you require. Note that both has_child and has_property are recursive and will need to be specified to the necessary depth as required in the query.

### Examples
Below are some sample GraphQL queries that can be executed against the API, with corresponding sample responses.

<table>
<tr>
<th>Description</th>
<th>Sample Query</th>
<th>Sample Response</th>
</tr>
<tr>
<td>Finds a specific product and its properties via exact code.</td>
<td><pre>
query GetProductsByCode {
  entity (code: "GH89P98W") {
    code 
    description
  }
}
</pre></td>
<td><pre>
{
  "data": {
    "entity": {
      "code": "GH89P98W",
      "description": "Paracetamol"
    }
  }
}
</pre></td>
</tr>
<tr>
<td>
An optional filter parameter is available when requesting products to specify what entity types to retrieve. <br /><br />
Valid values include: 
<pre>
form_category 
form
unit_of_use
product_pack
</pre>
</td>
<td>
<pre>
    query GetProductsByType {
      entities ( filter: { type: "form" } ) {
        code 
        description
        type
      }
    }
</pre></td>
<td><pre>
{
  "data": {
    "entities": [
      {
        "code": "AMOX0T4B",
        "description": "Amoxicillin oral tablet"
      },
      {
        "code": "P4R40T4B",
        "description": "Paracetamol oral tablet"
      },
      {
        "code": "AMOX0C4P",
        "description": "Amoxicillin oral capsule"
      },
      {
        "code": null,
        "description": "injection"
      }, 
      [...]
    ]
  }
}
</pre></td>
</tr>
<tr>
<td>
A parameterless query for entities will default to returning all medicinal products.
</td>
<td>
<pre>
    query GetAllProducts {
      entities {
        # medicinal_product
        code 
        description
        type
        has_property {
          type
          value
        }
        has_child {
          # form_category
          code 
          description
          type
          has_property {
            type
            value
          }
          has_child {
            # form
            code 
            description
            type
            has_child {
              # unit_of_use
              code 
              description
              type
              has_property {
                type
                value
              }
              has_child {
                # product_pack
                code 
                description
                type
                has_property {
                  type
                  value
                  has_property {
                    type
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
</pre>
</td>
<td><pre>
{
  "data": {
    "entities": [
      {
        "code": "GH89P98W",
        "description": "Paracetamol",
        "type": "medicinal_product",
        "has_property": [
          {
            "type": "ddd",
            "value": "3g"
          },
          {
            "type": "atc_code",
            "value": "N02BE01"
          }
        ],
        "has_child": [
          "code": null,
          "description": "Paracetamol oral",
          "type": "form_category",
          "has_property": null,
          "has_child": [ 
            [...]
          ]
        ],
      },
      {  
        "code": "QFWR9789",
        "description": "Amoxicillin",
        "type": "medicinal_product",
        "has_property": [ 
          [...]
        ],
        "has_child": [ 
          [...]
        ]
      }
    ]
  }
}
</pre></td>
</tr>
</table>

export const getEntityQuery = (code: string) => `
{
  queryEntity(filter: {code: {eq: "${code}"}}) {
    code
    description
    type: __typename
    properties {
      type: __typename
      value
    }
    children {
      code
      description
      type: __typename
      properties {
        type: __typename
        value
      }
      children {
        code
        description
        type: __typename
        properties {
          type: __typename
          value
        }
        children {
          code
          description
          type: __typename
          properties {
            type: __typename
            value
          }
          children {
            code
            description
            type: __typename
            properties {
              type: __typename
              value
            }
            children {
              code
              description
              type: __typename
              properties {
                type: __typename
                value
              }
            }
          }
        }
      }
    }
  }
}`;

// TODO: client library so we can use fragments etc...
// export const getEntityQuery = (code: string) => {
//   return `
//   fragment Details on Entity {
//     id
//     code
//     type: __typename
//     description
//     properties {
//       type: __typename
//       value
//     }
//   }

//   query Entity {
//     queryEntity(filter: {code: {alloftext: "${code}"}}) {
//       ...Details
//       children {
//         ...Details
//         children {
//           ...Details
// 					 children {
//             ...Details
// 						 children {
// 							...Details
// 							children {
// 								...Details
// 								children {
// 								  ...Details
// 									children {
// 						      	...Details
// 				      		}
// 								}
// 							}
// 						}
//           }
//         }
//       }
//     }
//   }`;
// };

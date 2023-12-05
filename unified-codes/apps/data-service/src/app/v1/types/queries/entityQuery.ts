export const getEntityQuery = (code: string) => `
fragment Details on Entity {
  id
  code
  type: __typename
  description
  properties {
    type: __typename
    value
  }
}
{
  queryEntity(filter: {code: {eq: "${code}"}}) {
    ...Details
    children {
      ...Details
      children {
        ...Details
         children {
          ...Details
           children {
            ...Details
            children {
              ...Details
              children {
                ...Details
                children {
                  ...Details
                }
              }
            }
          }
        }
      }
    }
  }
}`;

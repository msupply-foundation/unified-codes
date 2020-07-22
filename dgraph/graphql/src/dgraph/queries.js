export const queries = {
  entity: (code) => {  
      return `{
        query(func: eq(code, ${code})) @recurse(loop: false)  {
          code
          description
          type
          value
          has_child
          has_property
        }
      }`
    },
  entities: (type) => {
    return `{
      query(func: has(code)) @filter(eq(type, ${type})) @recurse(loop: false)  {
        code
        description
        type
        value
        has_child
        has_property
      }
    }`
  }
}

export default { queries };
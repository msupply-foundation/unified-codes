export const queries = {
  entity: (code: string) => {
    return `{
        query(func: eq(code, ${code}), first: 1) @recurse(loop: false)  {
          code
          description
          type
          value
          has_child
          has_property
        }
      }`;
  },
  entitiesByType: (type: string) => {
    return `{
      query(func: eq(type, ${type})) @filter(has(description)) @recurse(loop: false)  {
        code
        description
        type
        value
        has_child
        has_property
      }
    }`;
  },
  entitiesByDescriptionAndType: (type: string, description: string) => {
    return `{
      query(func: eq(type, ${type})) @filter(regexp(description, /.*${description}.*/i)) @recurse(loop: false)  {
        code
        description
        type
        value
        has_child
        has_property
      }
    }`;
  },
};

export default { queries };

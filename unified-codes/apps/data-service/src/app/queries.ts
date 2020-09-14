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
  entitiesByType: (type: string, order: string) => {
    return `{
      query(func: eq(type, ${type}), ${order}) @filter(has(description)) @recurse(loop: false)  {
        code
        description
        type
        value
        has_child
        has_property
      }
    }`;
  },
  entitiesByDescriptionAndType: (type: string, description: string, order: string) => {
    return `{
      query(func: eq(type, ${type}), ${order}) @filter(regexp(description, /.*${description}.*/i)) @recurse(loop: false)  {
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

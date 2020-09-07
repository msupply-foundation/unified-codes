export const queries = {
  entity: (code: string) => {
    return `{
        query(func: eq(code, ${code})) @recurse(loop: false)  {
          code
          description
          type
          value
          has_child
          has_property
        }
      }`;
  },
  entities: (type: string, pageSize: number, after: number) => {
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
};

export default { queries };

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
  entities: (type: string, order: string, offset: number, first: number, description?: string) => {
    const filter = description
      ? `@filter(regexp(description, /.*${description}.*/i))`
      : '@filter(has(description))';

    return `{
      all as counters(func: anyofterms(type, "${type}")) ${filter} { 
        total: count(uid)
      }
      
      query(func: uid(all), ${order}, offset: ${offset}, first: ${first}) @recurse(loop: false)  {
        code
        description
        type
        uid
        value
        has_child
        has_property
      }
    }`;
  },
};

export default { queries };

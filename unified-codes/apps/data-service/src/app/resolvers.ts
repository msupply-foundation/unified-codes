const queries = {
  entity: (code) => {
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
  entities: (type) => {
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

export const resolvers = {
  Query: {
    entity: async (_source, _args, context) => {
      const { user, authoriser, dataSources } = context;

      // TODO: add authorisation logic for any protected entities.
      const isAuthorised = user && authoriser.authorise(user);
      console.log(`Entity requested by ${isAuthorised ? 'authorised' : 'unauthorised'} user.`)

      const { code } = _args;
      const query = queries.entity(code);
      const response = await dataSources.dgraph.postQuery(query);
      const [entity] = response.data.query;
      return entity;
    },
    entities: async (_source, _args, context) => {
      const { user, authoriser, dataSources } = context;

      // TODO: add authorisation logic for any protected entities.
      if (!user) console.log('Entity requested by anonymous user.');
      else {
        const isAuthorised = user && authoriser.authorise(user);
        console.log(`Entity requested by ${isAuthorised ? 'authorised' : 'unauthorised'} user.`)
      }

      const { type = 'medicinal_product' } = _args?.filter ?? {};
      const query = queries.entities(type);
      const response = await dataSources.dgraph.postQuery(query);
      return response.data.query;
    },
  },
};

export default resolvers;

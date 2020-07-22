import { queries } from './dgraph/queries';

const resolvers = {
  Query: {
    entity: async (_source, _args, { dataSources }) => {
      const { code } = _args;
      const dgraphQuery = queries.entity(code);
      const response = await dataSources.dgraph.postQuery(dgraphQuery);
      return response.data.query;
    },
    entities: async (_source, _args, { dataSources }) => {
      const { filter } = _args;
      const { type } = filter;
      const dgraphQuery = queries.entities(type ?? 'medicinal_product');
      const response = await dataSources.dgraph.postQuery(dgraphQuery);
      return response.data.query;
    },
  },
};

export { resolvers };

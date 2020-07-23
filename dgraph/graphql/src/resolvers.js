import { queries } from './dgraph/queries';

const resolvers = {
  Query: {
    entity: async (_source, _args, { dataSources }) => {
      const { code } = _args;
      const dgraphQuery = queries.entity(code);
      const response = await dataSources.dgraph.postQuery(dgraphQuery);
      const [entity] = response.data.query;
      return entity;
    },
    entities: async (_source, _args, { dataSources }) => {
      const type = _args.filter?.type;
      const dgraphQuery = queries.entities(type ?? 'medicinal_product');
      const response = await dataSources.dgraph.postQuery(dgraphQuery);
      return response.data.query;
    },
  },
};

export { resolvers };

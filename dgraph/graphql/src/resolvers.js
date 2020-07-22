import { queries } from './dgraph/queries';

const resolvers = {
  Query: {
    entities: async (_source, _args, { dataSources }) => {
      const { filter } = _args;
      const dgraphQuery = queries.entities(filter);
      console.log(dgraphQuery);
      const response = await dataSources.dgraph.postQuery(dgraphQuery);
      return response.data.query;
    },
  }
};

export { resolvers };

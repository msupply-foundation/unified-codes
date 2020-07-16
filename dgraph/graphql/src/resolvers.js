import { UserInputError } from 'apollo-server-fastify';

const resolvers = {
  Query: {
    searchByName: async (_source, _args, { dataSources }) => {
      const dgraphQuery = `{
        query(func: regexp(description, /^${_args.text}/i)) @filter(has(code) AND eq(type, "unit_of_use")) {
          code
          description
        }
      }`;
      const response = await dataSources.dgraphDataSource.postQuery(dgraphQuery);
      return response.data.query;
    },
    getDrugInteractions: async (_source, _args, { dataSources }) => {
      // Query Dgraph for RxCui
      const dgraphQuery = `{
        query(func: eq(code, ${_args.code}))
        {
            description
            has_property @filter(eq(type, "RxNorm RxCUI")) {
              value
            }
        }
      }`;
      const response = await dataSources.dgraphDataSource.postQuery(dgraphQuery);

      // If RxCui found - Query RxNav for Interactions 
      if (response.data.query.length) {
        const rxCui = response.data.query[0].has_property.value;
        const rxNavResponse = await dataSources.rxNavDataSource.getInteractions(rxCui);
        return [{ name: 'fakeDrug', description: 'fakeInteraction', severity: 'high' }];
      }
      throw new UserInputError(`No RxCUI found for product with code ${_args.code}`);
    }
  },
};

export { resolvers };
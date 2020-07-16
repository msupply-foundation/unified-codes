const resolvers = {
  Query: {
    searchByName: async (_source, _args, { dataSources }) => {
      const dgraphQuery = `{
        query(func: has(code)) @filter(regexp(description, /^${_args.text}.*$/i) AND eq(type, "unit_of_use")) {
          code
          description
        }
      }`;
      const resp = await dataSources.dgraphDataSource.postQuery(dgraphQuery);
      return resp.data.query;
    },
    getDrugInteractions: async (_source, _args, { dataSources }) => {
      const resp = await dataSources.rxNavDataSource.getInteractions(_args.rxCui);
      return [{ name: 'fakeDrug', description: 'fakeInteraction', severity: 'high' }];
    }
  },
};

export { resolvers };
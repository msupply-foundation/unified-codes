import { UserInputError } from 'apollo-server-fastify';
import GraphQLJSON from 'graphql-type-json';

const resolvers = {
  Query: {
    entities: async (_source, _args, { dataSources }) => {
      const dgraphQuery = `{
        query(func: eq(type, ${_args.type ?? "medicinal_product"})) @recurse(depth: 9)  {
          code
          description
          type
          value
          has_child
          has_property
        }
      }`;
      const response = await dataSources.dgraph.postQuery(dgraphQuery);
      return response.data.query;
    },
    getDrugInteractions: async (_source, _args, { dataSources }) => {
      // Query Dgraph for RxCui
      const dgraphQuery = `{
        query(func: eq(code, ${_args.code}))
        {
            has_property @filter(eq(type, "RxNorm RxCUI")) {
              value
            }
        }
      }`;
      const response = await dataSources.dgraph.postQuery(dgraphQuery);

      // If RxCui found - Query RxNav for Interactions
      if (response.data.query.length) {
        const rxCui = response.data.query[0].has_property[0].value;
        return await dataSources.rxNav.getInteractions(rxCui);
      }
      throw new UserInputError(`No RxCUI found for product with code ${_args.code}`);
    },
  },
  JSON: GraphQLJSON,
};

export { resolvers };

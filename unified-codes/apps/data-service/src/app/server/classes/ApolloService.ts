import { ApolloServer, Config } from 'apollo-server-fastify';

import User from './User';
import JWT from './JWT';

export class ApolloService {
    typeDefs: Config["typeDefs"];
    resolvers: Config["resolvers"];
    dataSources: Config["dataSources"];

    constructor(typeDefs, resolvers, dataSources, authenticator) {
        this.typeDefs = typeDefs;
        this.resolvers = resolvers;
        this.dataSources = dataSources;
    }

    getServer() {
        return new ApolloServer({
            typeDefs: this.typeDefs,
            resolvers: this.resolvers,
            dataSources: this.dataSources,
            context: async ({ request }) => {
                const token = JWT.parseRequest(request);
                const user = new User(token);
                return { user };
            },
          });
    }
}

export default ApolloService;
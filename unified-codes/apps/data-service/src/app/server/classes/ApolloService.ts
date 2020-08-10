import { ApolloServer, Config } from 'apollo-server-fastify';

import UserAuthenticator from "./UserAuthenticator";

export class ApolloService {
    typeDefs: Config["typeDefs"];
    resolvers: Config["resolvers"];
    dataSources: Config["dataSources"];
    authenticator: UserAuthenticator;

    constructor(typeDefs, resolvers, dataSources, authenticator) {
        this.typeDefs = typeDefs;
        this.resolvers = resolvers;
        this.dataSources = dataSources;
        this.authenticator = authenticator;
    }

    getServer() {
        return new ApolloServer({
            typeDefs: this.typeDefs,
            resolvers: this.resolvers,
            dataSources: this.dataSources,
            context: async ({ request }) => {
                const user = await this.authenticator.getUser(request);
                return { user };
            },
          });
    }
}

export default ApolloService;
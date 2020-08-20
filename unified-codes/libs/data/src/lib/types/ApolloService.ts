import { ApolloServer, Config } from 'apollo-server-fastify';

import AuthorisationService from './AuthorisationService';
import IdentityProvider from './IdentityProvider';
import JWT, { JWTToken } from './JWT';
import User from './User';

type TypeDefs = Config['typeDefs'];
type Resolvers = Config['resolvers'];
type DataSources = Config['dataSources'];

export class ApolloService {
  typeDefs: TypeDefs;
  resolvers: Resolvers;
  dataSources: DataSources;
  authorisation: AuthorisationService;

  constructor(typeDefs: TypeDefs, resolvers: Resolvers, dataSources: DataSources, identityProvider: IdentityProvider) {
    this.typeDefs = typeDefs;
    this.resolvers = resolvers;
    this.dataSources = dataSources;
    this.authorisation = new AuthorisationService(identityProvider);
  }

  getServer() {
    return new ApolloServer({
      typeDefs: this.typeDefs,
      resolvers: this.resolvers,
      dataSources: this.dataSources,
      context: async ({ request }: { request: any }) => {
        try {
          const token: JWTToken = JWT.parseRequest(request);
          const user: User = new User(token);
          return {
            user,
            authorisation: this.authorisation
          }
        } catch (err) {
          return {};
        }
      }
    });
  }
}

export default ApolloService;


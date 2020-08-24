import { ApolloServer, Config } from 'apollo-server-fastify';
import { DataSource } from 'apollo-datasource';

import AuthorisationService from './AuthorisationService';
import IdentityProvider from './IdentityProvider';
import JWT, { JWTToken } from './JWT';
import AuthenticationService from './AuthenticationService';

type TypeDefs = Config['typeDefs'];
type Resolvers = Config['resolvers'];
type DataSources = Config['dataSources'];

export interface IApolloServiceContext {
  token?: JWTToken;
  authenticator: AuthenticationService;
  authoriser: AuthorisationService;
  dataSources: { [key: string]: DataSource<object> };
}

export class ApolloService {
  typeDefs: TypeDefs;
  resolvers: Resolvers;
  dataSources: DataSources;
  authenticator: AuthenticationService;
  authoriser: AuthorisationService;

  constructor(
    typeDefs: TypeDefs,
    resolvers: Resolvers,
    dataSources: DataSources,
    identityProvider: IdentityProvider
  ) {
    this.typeDefs = typeDefs;
    this.resolvers = resolvers;
    this.dataSources = dataSources;
    this.authenticator = new AuthenticationService(identityProvider);
    this.authoriser = new AuthorisationService(identityProvider);
  }

  getServer() {
    return new ApolloServer({
      typeDefs: this.typeDefs,
      resolvers: this.resolvers,
      dataSources: this.dataSources,
      context: async ({ request }: { request: any }) => {
        try {
          const token: JWTToken = JWT.parseRequest(request);
          return { token, authenticator: this.authenticator, authoriser: this.authoriser };
        } catch (err) {
          return { authenticator: this.authenticator, authoriser: this.authoriser };
        }
      },
    });
  }
}

export default ApolloService;

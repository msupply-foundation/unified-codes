import { JWTToken } from './JWT';
import IdentityProvider from './IdentityProvider';
import User, { IUserCredentials } from './User';

export class AuthenticationError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class AuthenticationService {
  provider: IdentityProvider;

  constructor(provider: IdentityProvider) {
    this.provider = provider;
  }

  async login(credentials: IUserCredentials): Promise<User> {
    const token: JWTToken = await this.provider.getIdentityToken(credentials);
    return new User(token);
  }

  async authenticate(token: JWTToken): Promise<User> {
    const isValid = this.provider.verifyIdentityToken(token);
    if (!isValid) throw new AuthenticationError('invalid user token');
    return new User(token);
  }
}

export default AuthenticationService;

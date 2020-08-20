import { JWTToken } from './JWT';
import IdentityProvider from './IdentityProvider';
import User, { IUserCredentials } from './User';

export class AuthenticationService {
  provider: IdentityProvider;

  constructor(provider: IdentityProvider) {
    this.provider = provider;
  }

  async authenticate(credentials: IUserCredentials): Promise<User> {
    const token: JWTToken = await this.provider.getIdentityToken(credentials);
    return new User(token);
  }
}

export default AuthenticationService;

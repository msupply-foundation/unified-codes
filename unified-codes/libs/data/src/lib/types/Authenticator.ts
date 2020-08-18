import { JWTToken } from './JWT';
import IdentityProvider from './IdentityProvider';
import User, { IUserCredentials } from './User';

export interface IAuthenticator {
  isAuthenticating: boolean,
}

export class Authenticator implements IAuthenticator {
  provider: IdentityProvider;
  isAuthenticating: boolean;

  constructor(provider: IdentityProvider) {
    this.provider = provider;
  }

  async authenticate(credentials: IUserCredentials) {
    this.isAuthenticating = true;
    const token: JWTToken = await this.provider.getIdentityToken(credentials);
    this.isAuthenticating = false;
    return new User(token);
  }
}

export default Authenticator;

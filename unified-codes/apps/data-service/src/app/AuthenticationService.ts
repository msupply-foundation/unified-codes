import { JWTToken } from './JWT';
import IdentityProvider from './IdentityProvider';
import User from './User';

export interface IUserCredentials {
  username: string;
  password: string;
}

export class AuthenticationService {
  provider: IdentityProvider;

  constructor(provider: IdentityProvider) {
    this.provider = provider;
  }

  // TODO: add headers or whatever we need to pass the credentials?
  async authenticate(credentials: IUserCredentials) {
    const token: JWTToken = await this.provider.getIdentityToken(credentials);
    return new User(token);
  }
}

export default AuthenticationService;

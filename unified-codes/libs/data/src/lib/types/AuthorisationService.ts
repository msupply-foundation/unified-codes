import User from './User';
import IdentityProvider from './IdentityProvider';

export class AuthorisationService {
  private provider: IdentityProvider;

  constructor(provider: IdentityProvider) {
    this.provider = provider;
  }

  // TODO: add permissions, e.g. authorise(user: User, permission: Permission)
  async authorise(user: User) {
    const { token } = user;
    return this.provider.verifyIdentityToken(token);
  }
}

export default AuthorisationService;

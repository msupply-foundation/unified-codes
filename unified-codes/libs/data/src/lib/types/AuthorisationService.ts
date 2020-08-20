import User from './User';
import IdentityProvider from './IdentityProvider';

export class AuthorisationService {
  private provider: IdentityProvider;

  constructor(provider: IdentityProvider) {
    this.provider = provider;
  }

  // TODO: add permissions, e.g. authorise(user: User, permission: Permission)
  async authorise(user: User) {
    return this.provider.verifyIdentityToken(user.token);
  }
}

export default AuthorisationService;

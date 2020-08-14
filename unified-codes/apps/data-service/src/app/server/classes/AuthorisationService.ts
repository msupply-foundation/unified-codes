import User from './User';
import JWT, { JWTToken } from './JWT';
import IdentityProvider from './IdentityProvider';

export interface IAuthorisationConfig {
    baseUrl: string,
}

export class AuthorisationError extends Error {
    constructor(message: string) {
        super(message);
    }
}

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
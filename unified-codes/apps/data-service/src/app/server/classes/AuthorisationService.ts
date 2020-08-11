import User from './User';
import JWT, { JWTToken } from './JWT';

export interface IAuthorisationConfig {
    baseUrl: string,
}

export class AuthorisationError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class AuthorisationService {
    private config: IAuthorisationConfig;
    private secret: string | null;

    constructor(config: IAuthorisationConfig) {
        this.config = config;
    }

    async init() {
        const response = await fetch(this.config.baseUrl);
        const payload = await response.json();
        this.secret = `
            -----BEGIN PUBLIC KEY-----
            ${payload?.public_key ?? ''}
            -----END PUBLIC KEY-----`;
    }

    async refresh() {
        this.init();
    }
    // TODO: add permissions, e.g. authorise(user: User, permission: Permission)
    authorise(user: User) {
        if (!this.secret) throw new AuthorisationError('public key not found');
        if (!user.verify(this.secret)) return false;
    }
}

export default AuthorisationService;
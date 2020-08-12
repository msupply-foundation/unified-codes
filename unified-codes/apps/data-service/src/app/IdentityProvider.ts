import JWT, { JWTToken } from './JWT';

export interface IIdentityCredentials {
  username: string;
  password: string;
}

export interface IKeyCloakConfig {
  baseUrl: string;
}

export class IdentityProviderError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export abstract class IdentityProvider {
  abstract async getIdentityToken(credentials: IIdentityCredentials): Promise<JWTToken>;
  abstract async verifyIdentityToken(token: JWTToken);
}

export class KeyCloakIdentityProvider extends IdentityProvider {
  config: IKeyCloakConfig;

  constructor(config: IKeyCloakConfig) {
    super();
    this.config = config;
  }

  async getIdentityToken(credentials: IIdentityCredentials) {
    // Add header/body/whatever we need to pass the credentials?
    const response = await fetch(this.config.baseUrl);
    const token: JWTToken = JWT.parseResponse(response);
    return token;
  }

  async verifyIdentityToken(token: JWTToken) {
    const response = await fetch(this.config.baseUrl);
    const payload = await response.json();
    const { public_key: publicKey } = payload ?? {};

    if (!publicKey) throw new IdentityProviderError('public key not found');

    const secret = `
            -----BEGIN PUBLIC KEY-----
            ${publicKey}
            -----END PUBLIC KEY-----
        `;
    return JWT.verifyToken(token, secret);
  }
}

export default IdentityProvider;

import fetch from 'cross-fetch';

import JWT, { JWTToken } from './JWT';
import { IUserCredentials } from './User';

export interface IKeyCloakConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  grantType: string;
}

export interface IKeyCloakCredentials extends IUserCredentials {
  clientId: string;
  clientSecret: string;
  grantType: string;
  username: string;
  password: string;
}

export class IdentityProviderError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export abstract class IdentityProvider {
  abstract async getIdentityToken(credentials: IUserCredentials): Promise<JWTToken>;
  abstract async verifyIdentityToken(token: JWTToken): Promise<boolean>;
}

export class KeyCloakIdentityProvider extends IdentityProvider {
  config: IKeyCloakConfig;

  constructor(config: IKeyCloakConfig) {
    super();
    this.config = config;
  }

  async getIdentityToken(credentials: IUserCredentials): Promise<JWTToken> {
    const { username, password } = credentials;

    const {
      baseUrl: url,
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      clientId: client_id,
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      clientSecret: client_secret,
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      grantType: grant_type,
    } = this.config;

    const identityData = Object.entries({
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      client_id,
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      client_secret,
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      grant_type,
      username,
      password,
    });

    const formData = identityData
      .reduce((acc, [key, value]) => [...acc, `${key}=${value}`], [])
      .join('&');

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: formData,
    });

    const token: JWTToken = await JWT.parseResponse(response);
    return token;
  }

  async verifyIdentityToken(token: JWTToken): Promise<boolean> {
    const { baseUrl: url } = this.config;

    try {
      const response = await fetch(url);
      const payload = await response.json();
      const { public_key: publicKey } = payload ?? {};

      if (!publicKey) throw new IdentityProviderError('public key not found');

      const secret = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;

      return JWT.verifyToken(token, secret);
    } catch (err) {
      return false;
    }
  }
}

export default IdentityProvider;

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
    const { baseUrl, clientId, clientSecret, grantType } = this.config;

    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', grantType);
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(baseUrl, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const token: JWTToken = JWT.parseResponse(response);
    return token;
  }

  async verifyIdentityToken(token: JWTToken): Promise<boolean> {
    try {
      const response = await fetch(this.config.baseUrl);
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

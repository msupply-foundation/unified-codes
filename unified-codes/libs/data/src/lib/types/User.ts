import { JWTToken } from './JWT';

export interface IUser {
  token: JWTToken,
  roles: string[]
};

export interface IUserCredentials {
  password: string;
  username: string;
}

export class UserError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class User implements IUser {
  token: JWTToken;
  roles: string[];

  private parseToken(token: JWTToken): string[] {
    const family_name = token.getProperty('family_name');
    const given_name = token.getProperty('given_name');
    const name = token.getProperty('name');
    const realm_access = token.getProperty('realm_access');
    const roles = realm_access?.roles;

    if (!family_name || !given_name || !name || !realm_access || !roles) {
      throw new UserError('malformed user jwt token');
    }

    return roles;
  }

  constructor(token: JWTToken) {
    this.token = token;
    this.roles = this.parseToken(token);
  }

  hasRole(role: string) {
    return this.roles.includes(role);
  }
}

export default User;
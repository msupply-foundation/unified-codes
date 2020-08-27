import { JWTToken } from './JWT';

export interface IUser {
  token: JWTToken;
  roles: string[];
}

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
    const familyName = token.getProperty('family_name');
    const givenName = token.getProperty('given_name');
    const name = token.getProperty('name');
    const realmAccess = token.getProperty('realm_access');
    const roles = realmAccess?.roles;

    if (!familyName || !givenName || !name || !realmAccess || !roles) {
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

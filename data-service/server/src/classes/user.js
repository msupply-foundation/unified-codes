import jwt from 'jsonwebtoken';

export class User {
  constructor(token, publicKey) {
    this.familyName = '';
    this.givenName = '';
    this.isValid = false;
    this.name = '';
    this.roles = [];

    try {
      if (!token) {
        return;
      }
      const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      const { realm_access } = decodedToken;
      const roles = realm_access ? realm_access.roles || [] : [];

      this.familyName = decodedToken.family_name;
      this.givenName = decodedToken.given_name;
      this.isValid = true;
      this.name = decodedToken.name;
      this.roles = roles;
    } catch (err) {
      console.warn(`Error: ${err.name} - ${err.message}`);
      // For example:
      //  err.name: "TokenExpiredError"
      //  err.message: "jwt expired"
      return;
    }
  }

  hasRole(role) {
    if (!this.roles?.length) return false;

    return this.roles.some((r) => r === role);
  }
}

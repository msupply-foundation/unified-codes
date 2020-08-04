import jwt from 'jsonwebtoken';

// const AUTH_BASE_URL = 'http://127.0.0.1:9990/auth/realms/unified-codes';
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhNA+lP2s2Ml9AEmpZCEzthEZ+52JhrLl1o9S/sFTFbBw/Fw4+Carq0rjlGU2wLEBfS8y2RSK3ay0PH+B2VQgpTQ7yIxGOdG4X2TLUUKwtXrUioMUvNLjLojsj1mPrSewx4JHmFhG5JC0uAs2cDnzKWeWmiumsDRF1JMFV0L1C4NHVscfnUQFlOs/CNQI4YFlQkY253tLqndAHwKL853VrU4pEuqGlV2bL7AqcFBgtIdfVlPy4uKVNsIrxsc/Dm6eT1M9GMfjQB2FSkBtdIuywuLlCCCZEiA0c4VGuUz0x7+1XP/rI3aU37NQBfg9mYU3w0zouAxF2WQZEc+DzAsMHQIDAQAB
-----END PUBLIC KEY-----`;

export class User {
  constructor(token) {
    this.familyName = '';
    this.givenName = '';
    this.isValid = false;
    this.name = '';
    this.roles = [];

    try {
      if (!token) {
        return;
      }
      const decodedToken = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
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

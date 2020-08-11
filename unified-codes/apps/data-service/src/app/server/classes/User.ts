import { JWTToken } from "./JWT";

export class UserError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class User {
    private token: JWTToken;
    private roles: string[];

    constructor(token: JWTToken) {
        this.token = token;

        const family_name = token.getProperty('family_name');
        const given_name = token.getProperty('given_name');
        const name = token.getProperty('name');
        const realm_access = this.token.getProperty('realm_access')
        const roles = realm_access?.roles;

        if (!family_name || !given_name || !name || !realm_access || !roles) {
            throw new UserError('malformed user jwt token'); 
        }

        this.roles = roles;
    }

    hasRole(role: string) {
        return this.roles.includes(role);
    }

    verify(secret: string) {
        return this.token.verify(secret);
    }
}

export default User;
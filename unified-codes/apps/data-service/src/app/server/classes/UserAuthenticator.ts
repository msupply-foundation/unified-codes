import fetch from 'node-fetch';

import User from './user';

export class UserAuthenticator {
    authUrl: string;

    constructor(authUrl: string) {
        this.authUrl = authUrl;
    }

    getToken(headers) {
        const tokenWithBearer = headers?.authorization ?? '';
        const [,token] = tokenWithBearer.split(' ');
        return token;
    }

    async getPublicKey() {
        const response = await fetch(this.authUrl);
        const openIdDetails = await response.json();
        const publicKey = `
            -----BEGIN PUBLIC KEY-----
            ${openIdDetails?.public_key}
            -----END PUBLIC KEY-----`;
        return publicKey;
    }

    async getUser(request) {
        const token = this.getToken(request?.headers ?? {});
        const publicKey = await this.getPublicKey();
        const user = new User(token, publicKey);
        return { user };
    }
}

export default UserAuthenticator;

import JWT, { JWTToken } from "./JWT";
import User from "./User";

export interface IUserCredentials {
    username: string;
    password: string;
}

export interface IAuthenticationConfig {
    baseUrl: string,
}

export class AuthenticationService {
    config: IAuthenticationConfig;

    constructor(config: IAuthenticationConfig) {
        this.config = config;
    }

    async authenticate(credentials: IUserCredentials) {
        // Get user JWT from keycloak, add headers or whatever we need to pass the credentials?
        const response = await fetch(this.config.baseUrl);
        const token: JWTToken = JWT.parseResponse(response);
        return new User(token);
    }
}

export default AuthenticationService;
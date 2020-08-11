import jwt, { DecodeOptions, JsonWebTokenError, NotBeforeError, Secret, TokenExpiredError, VerifyOptions } from 'jsonwebtoken';

export class JWTToken {    
    private token: string;
    private options: VerifyOptions;

    constructor(token: string, options?: VerifyOptions) {
        this.token = token;
        this.options = options ?? { algorithms: ['RS256'] };
    }

    get header() {
        const decoded = this.decode({ complete: true }) as { [key: string]: any };
        return decoded?.header;
    }

    get payload() {
        const decoded = this.decode({ complete: true }) as { [key: string]: any };
        return decoded?.payload;
    }

    getProperty(key: string) {
        return this.payload?.[key];
    }

    decode(options: DecodeOptions) {
        return jwt.decode(this.token, options);
    }

    verify(secret: Secret) {
        try { 
            const payload = jwt.verify(this.token, secret, this.options);
            return !!payload;
        }
        catch (err) {
            if (err instanceof JsonWebTokenError) return false;
            if (err instanceof NotBeforeError) return false;
            if (err instanceof TokenExpiredError) return false;
            throw err;
        } 
    }
}

export class JWT {
    private static isValid(token: string) {
        const headerPattern = '[A-Za-z0-9-_=]+';
        const payloadPattern = '[A-Za-z0-9-_=]+';
        const signaturePattern = '?[A-Za-z0-9-_.+/=]*';
        const jwtPattern = `^${headerPattern}\.${payloadPattern}\.${signaturePattern}$`;
        const regex = new RegExp(jwtPattern);
        return regex.test(token);
    }

    static parseAuthorisation(authorisation) {
        const [_,token] = authorisation.split(' ');
        if (!JWT.isValid(token)) throw new JsonWebTokenError('jwt malformed'); 
        return new JWTToken(token);
    }

    static parseRequest(request) {
        const { authorization = {} } = request;
        return JWT.parseAuthorisation(authorization);
    }

    static parseResponse(response) {
        const { authorization = {} } = response;
        return JWT.parseAuthorisation(authorization);
    }
}


export default JWT;
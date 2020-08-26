import JsonWebToken, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
  VerifyOptions,
} from 'jsonwebtoken';

export class JWTToken {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  get header() {
    const decoded = JsonWebToken.decode(this.token, { complete: true }) as { [key: string]: any };
    return decoded?.header;
  }

  get payload() {
    const decoded = JsonWebToken.decode(this.token, { complete: true }) as { [key: string]: any };
    return decoded?.payload;
  }

  getProperty(key: string) {
    return this.payload?.[key];
  }

  toString() {
    return this.token;
  }
}

export class JWT {
  private static defaultOptions: VerifyOptions = { algorithms: ['RS256'] };

  static validateToken(token: JWTToken) {
    const headerPattern = '[A-Za-z0-9-_=]+';
    const payloadPattern = '[A-Za-z0-9-_=]+';
    const signaturePattern = '?[A-Za-z0-9-_.+/=]*';
    const jwtExpected = `^${headerPattern}\.${payloadPattern}\.${signaturePattern}$`;
    const jwtActual = token.toString();
    const regex = new RegExp(jwtExpected);
    return regex.test(jwtActual);
  }

  static verifyToken(token: JWTToken, secret: string, options?: VerifyOptions) {
    try {
      const jwt = token.toString();
      const payload = JsonWebToken.verify(jwt, secret, options ?? JWT.defaultOptions);
      return !!payload;
    } catch (err) {
      if (err instanceof JsonWebTokenError) return false;
      if (err instanceof NotBeforeError) return false;
      if (err instanceof TokenExpiredError) return false;
      throw err;
    }
  }

  static parseRequest(request: any): JWTToken {
    const { headers } = request;
    const { authorisation } = headers;
    const [_, jwt] = authorisation.split(' ');
    if (!jwt) throw new JsonWebTokenError('authorisation header malformed');
    const token = new JWTToken(jwt);
    if (!JWT.validateToken(token)) throw new JsonWebTokenError('jwt malformed');
    return token;
  }

  static async parseResponse(response: any): Promise<JWTToken> {
    const json = await response.json();
    const { access_token: jwt } = json;
    if (!jwt) throw new JsonWebTokenError('access_token malformed');
    const token = new JWTToken(jwt);
    if (!JWT.validateToken(token)) throw new JsonWebTokenError('jwt malformed');
    return token;

  }
}

export default JWT;

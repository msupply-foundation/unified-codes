export interface IUser {
  isAuthenticated: boolean;
  loggingIn: boolean;
  name: string;
  roles: string[];
}

export interface IUserAuthentication {
  password: string;
  username: string;
}

export interface IAuthenticationResponse {
  authenticated: boolean;
  error?: string;
  user?: IUser;
}

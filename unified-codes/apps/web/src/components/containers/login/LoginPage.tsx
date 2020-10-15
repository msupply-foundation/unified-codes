import * as React from 'react';

import Login from './Login';
import LoginLayout from '../../layout/LoginLayout';

export interface LoginPageProps {
  onMount?: ({}) => void;
  onUnmount?: ({}) => void;
}

export type LoginPage = React.FunctionComponent<LoginPageProps>;

export const LoginPageComponent: LoginPage = ({
  onMount = ({}) => null,
  onUnmount = ({}) => null,
}) => {
  return <LoginLayout login={<Login />} />;
};

export const LoginPage = LoginPageComponent;

export default LoginPage;

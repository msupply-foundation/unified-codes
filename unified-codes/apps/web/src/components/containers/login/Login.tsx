import * as React from 'react';
import { connect } from 'react-redux';

import { Dialog, DialogContent, LoginForm } from '@unified-codes/ui/components';
import { IUserCredentials } from '@unified-codes/data';

import { AuthenticatorActions, IAuthenticatorAction } from '../../../actions';

export interface LoginProps {
  onLogin?: (credentials: IUserCredentials) => void;
}

export type Login = React.FunctionComponent<LoginProps>;

export const LoginComponent: Login = ({ onLogin = () => null }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  const closeDialog = React.useCallback(() => setIsOpen(false), []);

  const onSubmit = React.useCallback(
    (credentials: IUserCredentials) => {
      if (onLogin) onLogin(credentials);
      closeDialog();
    },
    [closeDialog, onLogin]
  );

  return (
    <Dialog open={isOpen} onClose={closeDialog}>
      <DialogContent dividers>
        <LoginForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};

const mapDispatchToProps = (dispatch: React.Dispatch<IAuthenticatorAction>) => {
  const onLogin = (credentials: IUserCredentials) =>
    dispatch(AuthenticatorActions.authenticate(credentials));
  return { onLogin };
};

export const Login = connect(null, mapDispatchToProps)(LoginComponent);

export default Login;

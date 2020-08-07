import * as React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { UserActions, IUserAuthenticationAction } from "../../actions";
import { IUserAuthentication } from "../../types";

import { Dialog, DialogContent } from "../atoms";
import { LoginForm } from "../organisms";

export interface LoginProps {
  onLogin?: (auth: IUserAuthentication) => void;
}

export type Login = React.FunctionComponent<LoginProps>;

const _Login: Login = ({ onLogin }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);
  const closeDialog = React.useCallback(() => setIsOpen(false), []);
  const onSubmit = React.useCallback((username, password) => {
    if (!onLogin) return;
    const auth = { username, password };
    onLogin(auth);
    closeDialog();
  }, []);

  return (
    <Dialog open={isOpen} onClose={closeDialog}>
      <DialogContent dividers>
        <LoginForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};

_Login.propTypes = {
  onLogin: PropTypes.func,
};

const mapStateToProps = () => ({});
const mapDispatchToProps = (
  dispatch: React.Dispatch<IUserAuthenticationAction>
) => {
  const onLogin = (auth: IUserAuthentication) =>
    dispatch(UserActions.login(auth));

  return { onLogin };
};
export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login);

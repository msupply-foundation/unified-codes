import * as React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { UserActions, IUserAction } from "../../actions";
import { IUser } from "../../types";

import { Dialog, DialogContent } from "../atoms";
import { LoginForm } from "../organisms";

export interface LoginProps {
  onLogin?: (username: string) => void;
}

export type Login = React.FunctionComponent<LoginProps>;

const _Login: Login = ({ onLogin }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);
  const closeDialog = React.useCallback(() => setIsOpen(false), []);
  const onSubmit = React.useCallback((username, password) => {
    onLogin ? onLogin(username) : null;
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
const mapDispatchToProps = (dispatch: React.Dispatch<IUserAction>) => {
  const onLogin = (username: string) => {
    const user: IUser = {
      name: username,
      isValid: true,
      roles: [],
    };
    dispatch(UserActions.login(user));
  };
  return { onLogin };
};
export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login);

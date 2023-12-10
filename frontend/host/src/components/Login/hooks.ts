import React from 'react';
import create from 'zustand';
import { AppRoute } from '@uc-frontend/config';
import {
  AuthenticationError,
  useAuthContext,
  useLocation,
  useNavigate,
} from '@uc-frontend/common';

interface LoginForm {
  error?: AuthenticationError;
  password: string;
  username: string;
  setError: (error?: AuthenticationError) => void;
  setPassword: (password: string) => void;
  setUsername: (username: string) => void;
}

interface State {
  from?: Location;
}

export const useLoginFormState = create<LoginForm>(set => ({
  error: undefined,
  password: '',
  username: '',

  setError: (error?: AuthenticationError) =>
    set(state => ({ ...state, error })),
  setPassword: (password: string) => set(state => ({ ...state, password })),
  setUsername: (username: string) => set(state => ({ ...state, username })),
}));

export const useLoginForm = (
  passwordRef: React.RefObject<HTMLInputElement>
) => {
  const state = useLoginFormState();
  const navigate = useNavigate();
  const location = useLocation();
  const { mostRecentlyUsedCredentials, login, isLoggingIn } = useAuthContext();
  const { password, setPassword, setUsername, username, error, setError } =
    state;

  const onLogin = async () => {
    setError();
    const { error, token } = await login(username, password);
    setError(error);
    setPassword('');
    if (!token) return;

    // navigate back, if redirected by the <RequireAuthentication /> component
    // or to the notifications page as a default
    const state = location.state as State | undefined;
    const from = state?.from?.pathname || `/${AppRoute.Admin}`;
    navigate(from, { replace: true });
  };

  const isValid = !!username && !!password;

  React.useEffect(() => {
    if (mostRecentlyUsedCredentials?.username && !username) {
      setUsername(mostRecentlyUsedCredentials.username);
      setTimeout(() => passwordRef.current?.focus(), 100);
    }
  }, [mostRecentlyUsedCredentials]);

  return { isValid, onLogin, isLoggingIn, ...state, error };
};

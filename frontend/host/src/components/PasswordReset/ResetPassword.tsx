import React, { useEffect, useState, lazy } from 'react';
import {
  ArrowRightIcon,
  useTranslation,
  LoadingButton,
  Box,
  Typography,
  AlertIcon,
  useHostContext,
  Stack,
  useSearchParams,
  useNavigate,
} from '@uc-frontend/common';
import Alert from '@mui/material/Alert';

import { LoginTextInput } from '../Login/LoginTextInput';
import { LoginIcon } from '../Login/LoginIcon';
import { useValidatePasswordResetToken } from './api/hooks/useValidatePasswordResetToken';
import { AppRoute } from '@uc-frontend/config';

const PasswordStrengthMeter = lazy(() => import('./PasswordStrengthMeter'));

import { useResetPasswordUsingToken } from './api/hooks/useResetPasswordUsingToken';

export const PasswordReset = () => {
  const t = useTranslation(['host']);
  const { setPageTitle } = useHostContext();
  const [password, setPassword] = React.useState('');
  const [isResettingPassword, setIsResettingPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const { mutateAsync: validatePasswordResetToken } =
    useValidatePasswordResetToken();
  const { mutateAsync: resetPasswordUsingToken } = useResetPasswordUsingToken();
  const [resetCompleted, setResetCompleted] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const resetToken = searchParams.get('token');

  const validateToken = async () => {
    if (!resetToken) {
      setIsValidToken(false);
      return;
    }
    await validatePasswordResetToken(resetToken)
      .then(() => {
        setIsValidToken(true);
      })
      .catch(e => {
        setIsValidToken(false);
        setErrorMessage(e.message);
      });
  };

  useEffect(() => {
    setPageTitle(`${t('password-reset')} | ${t('app')} `);
    validateToken();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      onPasswordReset();
    }
  };

  const onPasswordReset = async () => {
    setIsResettingPassword(true);
    setResetCompleted(false);
    setErrorMessage('');
    if (resetToken) {
      await resetPasswordUsingToken({ token: resetToken, password: password })
        .then(() => {
          setResetCompleted(true);
        })
        .catch(e => {
          setErrorMessage(e.message);
        });
    }

    setIsResettingPassword(false);
  };

  const saveNewPasswordButton = (
    <LoadingButton
      isLoading={isResettingPassword}
      onClick={onPasswordReset}
      variant="outlined"
      endIcon={<ArrowRightIcon />}
      disabled={false}
    >
      {t('button.save-new-password')}
    </LoadingButton>
  );

  const returnToForgotPassword = (
    <LoadingButton
      isLoading={isResettingPassword}
      onClick={() => {
        navigate('/' + AppRoute.ForgotPassword);
      }}
      variant="outlined"
      endIcon={<ArrowRightIcon />}
    >
      {t('button.return-to-forgot-password')}
    </LoadingButton>
  );

  const returnToLogin = (
    <LoadingButton
      isLoading={isResettingPassword}
      onClick={() => {
        navigate('/' + AppRoute.Login);
      }}
      variant="outlined"
      endIcon={<ArrowRightIcon />}
    >
      {t('button.return-to-login')}
    </LoadingButton>
  );

  return (
    <Box display="flex" style={{ width: '100%' }}>
      <Box
        flex="1 0 100%"
        sx={{
          backgroundColor: 'background.login',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        display="flex"
      >
        <Box>
          <form onSubmit={onPasswordReset} onKeyDown={handleKeyDown}>
            <Stack spacing={5}>
              <Box display="flex" justifyContent="center">
                <LoginIcon />
              </Box>

              {errorMessage ? (
                <Box style={{ marginTop: 45 }}>
                  <Box display="flex" sx={{ color: 'error.main' }} gap={1}>
                    <Box>
                      <AlertIcon />
                    </Box>
                    <Box>
                      <Typography sx={{ color: 'inherit' }}>
                        {errorMessage || t('error.login')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : null}

              {isValidToken && !resetCompleted ? (
                <Box>
                  <Box display="flex" justifyContent="flex-end">
                    <Box>
                      <LoginTextInput
                        type="password"
                        fullWidth
                        label={t('password-reset.explanation')}
                        value={password}
                        disabled={isResettingPassword}
                        onChange={e => setPassword(e.target.value)}
                        inputProps={{
                          autoComplete: 'password',
                        }}
                        autoFocus
                      />
                      <PasswordStrengthMeter
                        password={password}
                        userInfo={[]}
                      />
                    </Box>
                  </Box>
                </Box>
              ) : null}

              {resetCompleted ? (
                <Box>
                  <Alert variant="outlined" severity="success">
                    {t('password-reset.completed-success')}
                  </Alert>
                  <Box display="flex" justifyContent="flex-end">
                    {returnToLogin}
                  </Box>
                </Box>
              ) : (
                <Box display="flex" justifyContent="flex-end">
                  {isValidToken
                    ? saveNewPasswordButton
                    : returnToForgotPassword}
                </Box>
              )}
            </Stack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

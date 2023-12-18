import React, { lazy, useEffect, useState } from 'react';
import {
  ArrowRightIcon,
  useTranslation,
  LoadingButton,
  Box,
  Typography,
  AlertIcon,
  Stack,
  useSearchParams,
  useNavigate,
  useHostContext,
  isValidUsername,
  validateUsernameHelperText,
} from '@uc-frontend/common';
import Alert from '@mui/material/Alert';

import { useValidatePasswordResetToken } from './api/hooks/useValidatePasswordResetToken';

import { LoginIcon } from '../Login/LoginIcon';
import { LoginTextInput } from '../Login/LoginTextInput';
import { useUserAccountAcceptInvite } from '../../../../system/src/Admin/Users/api/hooks/document/useUserAccountAcceptInvite';
import { AppRoute } from '@uc-frontend/config';

const PasswordStrengthMeter = lazy(() => import('./PasswordStrengthMeter'));

export const VerifyAccount = () => {
  const t = useTranslation(['host', 'system']);
  const { setPageTitle } = useHostContext();
  const [accountInfo, setAccountInfo] = React.useState({
    username: '',
    password: '',
    displayName: '',
  });
  const [isResettingAccountInfo, setIsResettingAccountInfo] =
    React.useState(false);
  const { mutateAsync: validatePasswordResetToken } =
    useValidatePasswordResetToken();
  const { mutateAsync: userAccountAcceptInvite } = useUserAccountAcceptInvite();
  const [isValidToken, setIsValidToken] = useState(true);

  const [errorMessage, setErrorMessage] = React.useState('');
  const [resetCompleted, setResetCompleted] = useState(false);
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
    setPageTitle(`${t('set-up-account')} | ${t('app')} `);
    validateToken();
  }, [resetToken]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      onInviteAccept();
    }
  };

  const onInviteAccept = async () => {
    setIsResettingAccountInfo(true);
    setResetCompleted(false);
    setErrorMessage('');
    if (resetToken) {
      await userAccountAcceptInvite({
        token: resetToken,
        input: accountInfo,
      })
        .then(() => {
          setResetCompleted(true);
        })
        .catch(e => {
          setErrorMessage(e.message);
        });
    }

    setIsResettingAccountInfo(false);
  };

  const saveNewAccountInfoButton = (
    <LoadingButton
      isLoading={isResettingAccountInfo}
      onClick={() => {
        onInviteAccept();
      }}
      variant="outlined"
      endIcon={<ArrowRightIcon />}
      disabled={false}
    >
      {t('button.activate-account')}
    </LoadingButton>
  );

  const returnToHome = (
    <LoadingButton
      isLoading={isResettingAccountInfo}
      onClick={() => {
        navigate('/' + AppRoute.Home);
      }}
      variant="outlined"
      endIcon={<ArrowRightIcon />}
    >
      {t('button.return-to-home', { ns: 'system' })}
    </LoadingButton>
  );

  const returnToLogin = (
    <LoadingButton
      isLoading={isResettingAccountInfo}
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
          <form onSubmit={onInviteAccept} onKeyDown={handleKeyDown}>
            <Stack spacing={5}>
              <Box display="flex" justifyContent="center">
                <LoginIcon />
              </Box>

              {isValidToken && !resetCompleted ? (
                <Box style={{ marginTop: 10 }}>
                  <Box style={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: 'text.primary' }}>
                      {t('heading.welcome')}
                    </Typography>
                    <p>{t('messages.verify-user-more-details')}</p>
                  </Box>
                  <Box style={{ marginTop: 10 }}>
                    <LoginTextInput
                      type="username"
                      fullWidth
                      label={t('username-reset.explanation')}
                      value={accountInfo.username}
                      error={!isValidUsername(accountInfo.username)}
                      helperText={validateUsernameHelperText(
                        accountInfo.username,
                        t
                      )}
                      disabled={isResettingAccountInfo}
                      onChange={e =>
                        setAccountInfo({
                          username: e.target.value,
                          password: accountInfo.password,
                          displayName: accountInfo.displayName,
                        })
                      }
                      inputProps={{
                        autoComplete: 'username',
                      }}
                      autoFocus
                    />
                  </Box>
                  <Box style={{ marginTop: 10 }}>
                    <LoginTextInput
                      type="display-name"
                      fullWidth
                      label={t('preferred-name-reset.explanation')}
                      value={accountInfo.displayName}
                      disabled={isResettingAccountInfo}
                      onChange={e =>
                        setAccountInfo({
                          username: accountInfo.username,
                          password: accountInfo.password,
                          displayName: e.target.value,
                        })
                      }
                      autoFocus
                    />
                  </Box>
                  <Box style={{ marginTop: 10 }}>
                    <LoginTextInput
                      type="password"
                      fullWidth
                      label={t('password-reset.explanation')}
                      value={accountInfo.password}
                      disabled={isResettingAccountInfo}
                      onChange={e =>
                        setAccountInfo({
                          username: accountInfo.username,
                          password: e.target.value,
                          displayName: accountInfo.displayName,
                        })
                      }
                      inputProps={{
                        autoComplete: 'password',
                      }}
                      autoFocus
                    />
                    <PasswordStrengthMeter
                      password={accountInfo.password}
                      userInfo={[accountInfo.username, accountInfo.displayName]}
                    />
                  </Box>
                </Box>
              ) : null}

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

              {resetCompleted ? (
                <Box>
                  <Alert variant="outlined" severity="success">
                    {t('activate-account.completed-success')}
                  </Alert>
                  <Box display="flex" justifyContent="flex-end">
                    {returnToLogin}
                  </Box>
                </Box>
              ) : (
                <Box display="flex" justifyContent="flex-end">
                  {isValidToken ? saveNewAccountInfoButton : returnToHome}
                </Box>
              )}
            </Stack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

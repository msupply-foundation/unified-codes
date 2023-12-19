import React, { useEffect, useState } from 'react';
import {
  ArrowRightIcon,
  useTranslation,
  LoadingButton,
  Box,
  Typography,
  AlertIcon,
  useHostContext,
  Stack,
  useNavigate,
} from '@uc-frontend/common';
import Alert from '@mui/material/Alert';

import { LoginTextInput } from '../Login/LoginTextInput';
import { LoginIcon } from '../Login/LoginIcon';
import { useInitiatePasswordReset } from './api/hooks/useInitiatePasswordReset';
import { AppRoute } from '@uc-frontend/config';

export const ForgotPassword = () => {
  const t = useTranslation(['system', 'host']);
  const { setPageTitle } = useHostContext();
  const [emailAddress, setEmailAddress] = React.useState('');
  const [isResettingPassword, setIsResettingPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const { mutateAsync: initiatePasswordReset } = useInitiatePasswordReset();
  const [resetInitiated, setResetInitiated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle(
      `${t('password-reset', { ns: 'host' })} | ${t('app', { ns: 'host' })} `
    );
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      onResetInitated();
    }
  };

  const onResetInitated = async () => {
    setIsResettingPassword(true);
    setResetInitiated(false);
    setErrorMessage('');

    await initiatePasswordReset(emailAddress)
      .then(() => {
        setResetInitiated(true);
      })
      .catch(e => {
        setErrorMessage(e.message);
      });

    setIsResettingPassword(false);
  };

  const sendResetLinkButton = (
    <LoadingButton
      isLoading={isResettingPassword}
      onClick={onResetInitated}
      variant="outlined"
      endIcon={<ArrowRightIcon />}
      disabled={
        emailAddress.length === 0 || emailAddress.search(/.+@.+/) === -1
      }
    >
      {t('button.send-password-reset')}
    </LoadingButton>
  );

  const returnToHomeButton = (
    <LoadingButton
      onClick={() => {
        navigate('/' + AppRoute.Login);
      }}
      isLoading={false}
    >
      {t('button.return-to-home')}
    </LoadingButton>
  );

  return (
    <Box display="flex" style={{ width: '100%' }}>
      <Box
        flex="1 0 50%"
        sx={{
          backgroundColor: 'background.login',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        display="flex"
      >
        <Box>
          <form onSubmit={onResetInitated} onKeyDown={handleKeyDown}>
            <Stack spacing={5}>
              <Box display="flex" justifyContent="center">
                <LoginIcon />
              </Box>
              <Box style={{ marginTop: 45 }}>
                <Typography
                  sx={{
                    fontSize: {
                      xs: '8px',
                      sm: '10px',
                      md: '12px',
                      lg: '16px',
                      xl: '18px',
                    },
                    fontWeight: 600,
                  }}
                >
                  {t('password-reset.initiate')}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="flex-end">
                <LoginTextInput
                  fullWidth
                  label={t('label.email')}
                  value={emailAddress}
                  disabled={isResettingPassword}
                  onChange={e => setEmailAddress(e.target.value)}
                  inputProps={{
                    autoComplete: 'emailAddress',
                  }}
                  autoFocus
                />
              </Box>
              {errorMessage && (
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
              )}
              {resetInitiated ? (
                <>
                  <Alert variant="outlined" severity="success">
                    {t('password-reset.initiate-success', { ns: 'host' })}
                  </Alert>
                  <Box display="flex" justifyContent="flex-end">
                    {returnToHomeButton}
                  </Box>
                </>
              ) : (
                <Box display="flex" justifyContent="flex-end">
                  {sendResetLinkButton}
                </Box>
              )}
            </Stack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

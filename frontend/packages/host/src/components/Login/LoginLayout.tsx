import React from 'react';
import {
  Box,
  Link,
  Stack,
  Typography,
  useTranslation,
} from '@uc-frontend/common';
import { LoginIcon } from './LoginIcon';
import { Theme } from '@common/styles';
import { AppRoute } from 'packages/config/src';

type LoginLayoutProps = {
  UsernameInput: React.ReactNode;
  PasswordInput: React.ReactNode;
  LoginButton: React.ReactNode;
  ErrorMessage: React.ReactNode;
  onLogin: () => Promise<void>;
};

export const LoginLayout = ({
  UsernameInput,
  PasswordInput,
  LoginButton,
  ErrorMessage,
  onLogin,
}: LoginLayoutProps) => {
  const t = useTranslation(['host']);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      onLogin();
    }
  };

  return (
    <Box display="flex" style={{ width: '100%' }}>
      <Box
        flex="1 0 50%"
        sx={{
          backgroundImage: (theme: Theme) => theme.mixins.gradient.primary,
          padding: '0 80px 7% 80px',
        }}
        display="flex"
        alignItems="flex-start"
        justifyContent="flex-end"
        flexDirection="column"
      >
        <Box>
          <Typography
            sx={{
              color: (theme: Theme) => theme.typography.login.color,
              fontSize: {
                xs: '38px',
                sm: '38px',
                md: '48px',
                lg: '64px',
                xl: '64px',
              },
              fontWeight: 'bold',
              lineHeight: 'normal',
              whiteSpace: 'pre-line',
            }}
          >
            {t('login.heading')}
          </Typography>
        </Box>
        <Box style={{ marginTop: 45 }}>
          <Typography
            sx={{
              fontSize: {
                xs: '12px',
                sm: '14px',
                md: '16px',
                lg: '20px',
                xl: '20px',
              },
              color: (theme: Theme) => theme.typography.login.color,
              fontWeight: 600,
            }}
          >
            {t('login.body')}
          </Typography>
        </Box>
      </Box>
      <Box
        flex="1 0 50%"
        sx={{
          backgroundColor: 'background.login',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        display="flex"
      >
        <Box style={{ width: 285 }}>
          <form onSubmit={onLogin} onKeyDown={handleKeyDown}>
            <Stack spacing={5}>
              <Box display="flex" justifyContent="center">
                <LoginIcon />
              </Box>
              {UsernameInput}
              {PasswordInput}
              {ErrorMessage}
              <Box display="flex" justifyContent="flex-end">
                {LoginButton}
              </Box>
            </Stack>
          </form>
          <Box display="flex" justifyContent="center">
            <Link to={'/' + AppRoute.ForgotPassword}>
              {t('login.forgot-password')}
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

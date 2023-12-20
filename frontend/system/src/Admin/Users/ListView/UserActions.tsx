import React, { FC, useState } from 'react';
import {
  ButtonWithIcon,
  Grid,
  Box,
  AlertIcon,
  Typography,
  PlusCircleIcon,
  useTranslation,
} from '@uc-frontend/common';
import { useInitiatePasswordReset } from '../../../../../host/src/components/PasswordReset/api/hooks/useInitiatePasswordReset';
import Alert from '@mui/material/Alert';

interface UserActionsProps {
  email: string | null;
  userId: string;
}

export const UserActions: FC<UserActionsProps> = ({ email, userId }) => {
  const [isResettingPassword, setIsResettingPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [resetInitiated, setResetInitiated] = useState(false);
  const { mutateAsync: initiatePasswordReset } = useInitiatePasswordReset();
  const t = useTranslation(['system', 'host']);
  const emailAddress: string = email ?? '';

  const onResetInitated = async () => {
    setIsResettingPassword(true);
    setResetInitiated(false);
    setErrorMessage('');

    await initiatePasswordReset(userId)
      .then(() => {
        setResetInitiated(true);
      })
      .catch(e => {
        setErrorMessage(e.errorMessage);
        console.log(errorMessage);
      });

    setIsResettingPassword(false);
  };

  return (
    <>
      <Grid container gap={0.5} padding={0.5}>
        <ButtonWithIcon
          disabled={!emailAddress || isResettingPassword}
          Icon={<PlusCircleIcon />}
          label={t('label.send-password-reset')}
          onClick={e => {
            e.stopPropagation();
            onResetInitated();
          }}
        ></ButtonWithIcon>
      </Grid>
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
        <Alert variant="outlined" severity="success">
          {t('password-reset.initiate-success-external', { ns: 'host' })}
        </Alert>
      ) : (
        <Box display="flex" justifyContent="flex-end">
          {/* {sendResetLinkButton} */}
        </Box>
      )}
    </>
  );
};

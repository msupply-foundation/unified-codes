import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { ErrorBoundaryFallbackProps } from './types';
import { UnhappyMan } from 'frontend/common/src/ui/icons';
import { useTranslation } from 'frontend/common/src/intl';
import { BaseButton } from '../buttons';

export const GenericErrorFallback: FC<ErrorBoundaryFallbackProps> = ({
  onClearError,
}) => {
  const t = useTranslation('common');

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      flex={1}
    >
      <UnhappyMan />
      <Typography style={{ padding: 20 }} variant="h3">
        {t('error.something-wrong')}
      </Typography>
      <BaseButton onClick={onClearError}>{t('button.try-again')}</BaseButton>
    </Box>
  );
};

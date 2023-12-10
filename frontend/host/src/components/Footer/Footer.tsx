import React from 'react';
import {
  Box,
  styled,
  Tooltip,
  Typography,
  useAuthContext,
  UserIcon,
  useTranslation,
} from '@uc-frontend/common';

export const Footer: React.FC = () => {
  const { user } = useAuthContext();
  const t = useTranslation();
  const PaddedCell = styled(Box)({ display: 'flex' });
  const iconStyles = { color: 'gray.main', height: '16px', width: '16px' };
  const textStyles = {
    color: 'gray.main',
    fontSize: '12px',
    marginInlineStart: '8px',
  };

  return (
    <Box gap={2} display="flex" flex={1} alignItems="center">
      {user ? (
        <Tooltip
          title={
            Array.isArray(user.permissions) && user.permissions.length > 0
              ? t('label.role') + ' : ' + user.permissions.join(' ')
              : ''
          }
        >
          <PaddedCell>
            <UserIcon sx={iconStyles} />
            <Typography sx={textStyles}>{user.displayName}</Typography>
          </PaddedCell>
        </Tooltip>
      ) : null}
    </Box>
  );
};

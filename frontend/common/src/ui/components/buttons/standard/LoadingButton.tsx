import React from 'react';
import { ButtonProps, CircularProgress } from '@mui/material';
import { BaseButton } from './BaseButton';

export const LoadingButton: React.FC<ButtonProps & { isLoading: boolean }> = ({
  children,
  disabled,
  endIcon,
  isLoading,
  startIcon,
  onClick,
  ...rest
}) => {
  return isLoading ? (
    <BaseButton
      startIcon={<CircularProgress size={20} />}
      disabled
      {...rest}
      sx={{
        '&.Mui-disabled': {
          backgroundColor: 'background.white',
        },
      }}
    />
  ) : (
    <BaseButton
      disabled={disabled}
      endIcon={endIcon}
      startIcon={startIcon}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onClick && onClick({} as any);
        }
      }}
      {...rest}
    >
      {children}
    </BaseButton>
  );
};

import React from 'react';
import { IconButton as MuiIconButton, SxProps, Tooltip } from '@mui/material';

interface ButtonProps {
  disabled?: boolean;
  icon: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  width?: string;
  height?: string;
  sx?: SxProps;
  color?: 'inherit' | 'default' | 'primary' | 'secondary' | 'info';
  tabIndex?: number;
}

export const IconButton: React.FC<ButtonProps> = ({
  disabled,
  icon,
  onClick,
  label,
  width,
  height,
  sx,
  color = 'default',
  tabIndex,
}) => (
  <Tooltip title={disabled ? '' : label}>
    <MuiIconButton
      color={color}
      sx={{ width, height, ...sx }}
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      size="small"
      tabIndex={tabIndex}
    >
      {icon}
    </MuiIconButton>
  </Tooltip>
);

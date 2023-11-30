import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

export const LogoutIcon = ({ ...props }: SvgIconProps): JSX.Element => {
  const combinedProps: SvgIconProps = {
    style: {
      fill: 'none',
    },
    ...props,
  };
  return (
    <SvgIcon
      {...combinedProps}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </SvgIcon>
  );
};

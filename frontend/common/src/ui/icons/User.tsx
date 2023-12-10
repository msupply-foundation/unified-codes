import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

export const UserIcon = (props: SvgIconProps): JSX.Element => {
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </SvgIcon>
  );
};

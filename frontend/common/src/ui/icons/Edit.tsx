import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

export const EditIcon = (props: SvgIconProps): JSX.Element => {
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
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </SvgIcon>
  );
};

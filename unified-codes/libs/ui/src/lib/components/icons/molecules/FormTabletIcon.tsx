import React from 'react';
import { SvgIcon } from '../atoms';

export const FormTabletIcon: SvgIcon = ({ height = 48, width = 48, ...props }) => {
  const combinedProps = {
    viewBox: '0 0 48 48',
    ...props,
    style: {
      height,
      width,
      ...props.style,
    },
  };
  return (
    <SvgIcon {...combinedProps}>
      <g>
        <ellipse fill="rgb(182,49,95)" cx="24" cy="24" rx="24" ry="24" />
        <g mask="url(#mask-3)">
          <rect
            width="50"
            height="6"
            x="-1"
            y="21"
            fill="rgb(255,255,255)"
            rx="0"
            ry="0"
            transform="rotate(-45.000016 24 24)"
          />
        </g>
      </g>
    </SvgIcon>
  );
};

export default FormTabletIcon;

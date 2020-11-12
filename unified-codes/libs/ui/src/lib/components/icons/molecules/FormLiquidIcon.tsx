import React from 'react';
import { SvgIcon } from '../atoms';

export const FormLiquidIcon: SvgIcon = ({ height = 49.057, width = 48, ...props }) => {
  const combinedProps = {
    viewBox: '0 0 48 49.057',
    ...props,
    style: {
      height,
      width,
      ...props.style,
    },
  };
  return (
    <SvgIcon {...combinedProps}>
      <path
        fill="rgb(182,49,95)"
        fillRule="evenodd"
        d="M24.000007 48c11.04563459 0 19.99989063-3.745166 19.99989063-17C43.94556 20 24.9504812 0 24.000007 0 23.04953279 0 4.0226547 20 4.00011637 31c0 13.254834 8.95425603 17 19.99989063 17z"
      />
      <path
        fill="none"
        stroke="rgb(255,255,255)"
        strokeLinecap="round"
        strokeLinejoin="miter"
        strokeWidth="3"
        d="M10 35.04794405C13.03561526 39.69992558 18.16631027 42 23.98440107 42 29.82244465 42 34.96839276 39.6841226 38 35"
      />
    </SvgIcon>
  );
};

export default FormLiquidIcon;

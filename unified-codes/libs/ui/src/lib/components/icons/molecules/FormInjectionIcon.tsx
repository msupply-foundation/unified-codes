import React from 'react';
import { SvgIcon } from '../atoms';

export const FormInjectionIcon: SvgIcon = ({ height = 48, width = 48, ...props }) => {
  const combinedProps = {
    viewBox: '0 0 48 48.101',
    ...props,
    style: {
      height,
      width,
      ...props.style,
    },
  };
  return (
    <SvgIcon {...combinedProps}>
      <g transform="translate(0 .10121933)">
        <rect
          width="14"
          height="5"
          x="30.289"
          y="8.211"
          fill="rgb(182,49,95)"
          rx="0"
          ry="0"
          transform="rotate(-45.000016 37.28858223 10.71141777)"
        />
        <rect
          width="16"
          height="2"
          x="-1.117"
          y="40.117"
          fill="rgb(182,49,95)"
          rx="0"
          ry="0"
          transform="rotate(-45.000016 6.88299064 41.11700936)"
        />
        <rect
          width="24"
          height="12"
          x="9.025"
          y="20.975"
          fill="rgb(182,49,95)"
          rx="0"
          ry="0"
          transform="rotate(-45.000016 21.02512627 26.97487373)"
        />
        <rect
          width="10"
          height="6"
          x="13.904"
          y="26.096"
          fill="rgb(255,255,255)"
          rx="0"
          ry="0"
          transform="rotate(-45.000016 18.90380592 29.09619408)"
        />
        <rect
          width="4"
          height="18"
          x="28.925"
          y="8.075"
          fill="rgb(182,49,95)"
          rx="0"
          ry="0"
          transform="rotate(-45.000016 30.9246212 17.0753788)"
        />
        <rect
          width="3.6"
          height="9"
          x="41.554"
          y="-.146"
          fill="rgb(182,49,95)"
          rx="0"
          ry="0"
          transform="rotate(-45.000016 43.3535534 4.3535534)"
        />
      </g>
    </SvgIcon>
  );
};

export default FormInjectionIcon;

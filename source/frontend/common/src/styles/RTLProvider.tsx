import React, { FC } from 'react';
import { IntlUtils } from 'frontend/common/src/intl';
import { PropsWithChildrenOnly } from 'frontend/common/src/types';

export const RTLProvider: FC<PropsWithChildrenOnly> = props => {
  const isRtl = IntlUtils?.useRtl();

  return (
    <div
      style={{
        height: '100%',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
      {...props}
    />
  );
};

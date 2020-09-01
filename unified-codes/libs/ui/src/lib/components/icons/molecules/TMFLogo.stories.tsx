import React from 'react';
import { TMFLogo } from './TMFLogo';

export default {
  component: TMFLogo,
  title: 'Icons/TMFLogo',
};

export const withNoProps = () => {
  return (
    <div style={{ backgroundColor: '#253240' }}>
      <TMFLogo />
    </div>
  );
};

export const withSpecificSize = () => {
  return (
    <div style={{ backgroundColor: '#253240' }}>
      <TMFLogo style={{ height: 360, width: 648 }} />
    </div>
  );
};

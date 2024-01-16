import React from 'react';
import { useDrawer, UCLogo } from '@uc-frontend/common';

export const AppDrawerIcon: React.FC = () => {
  const drawer = useDrawer();

  return drawer.isOpen ? (
    <UCLogo size={'large'} showName />
  ) : (
    <UCLogo size={'medium'} />
  );
};

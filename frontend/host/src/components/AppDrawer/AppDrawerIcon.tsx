import React from 'react';
import { useDrawer, UCLogo } from '@uc-frontend/common';

export const AppDrawerIcon: React.FC = () => {
  const drawer = useDrawer();

  return <UCLogo size={drawer.isOpen ? 'large' : 'medium'} />;
};

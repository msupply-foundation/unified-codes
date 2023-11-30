import React from 'react';
import {
  RegexUtils,
  AnimatedMSupplyGuy,
  useDrawer,
  useLocalStorage,
  useTheme,
} from '@uc-frontend/common';

export const AppDrawerIcon: React.FC = () => {
  const drawer = useDrawer();
  const theme = useTheme();
  const [customLogo] = useLocalStorage('/theme/logo');

  if (!customLogo)
    return <AnimatedMSupplyGuy size={drawer.isOpen ? 'large' : 'medium'} />;

  const style = drawer.isOpen
    ? { paddingTop: 20, width: 64, fill: theme.mixins.drawer?.iconColor }
    : { width: 30, fill: theme.mixins.drawer?.iconColor };

  return RegexUtils.extractSvg(customLogo, style);
};

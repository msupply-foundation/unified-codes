import React from 'react';
import {
  useLocalStorage,
  useTheme,
  RegexUtils,
  useIsSmallScreen,
  UCLogo,
} from '@uc-frontend/common';

export const LoginIcon = ({ small = false }: { small?: boolean }) => {
  const [customLogo] = useLocalStorage('/theme/logo');
  const isSmallScreen = useIsSmallScreen() || small;
  const logoStyle = isSmallScreen
    ? { width: 61, height: 90 }
    : { width: 285, height: 180 };
  const theme = useTheme();

  if (!customLogo)
    return <UCLogo showName style={{ height: 180, width: 210 }} />;

  const style = {
    ...logoStyle,
    fill: theme.palette.background.drawer,
  };
  return RegexUtils.extractSvg(customLogo, style);
};

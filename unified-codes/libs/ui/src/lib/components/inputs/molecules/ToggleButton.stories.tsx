import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../../../../../../apps/web/src/muiTheme';

import ToggleButton from './ToggleButton';

export default {
  component: ToggleButton,
  title: 'ToggleButton',
};

export const Unselected = () => (
  <ThemeProvider theme={theme}>
    <ToggleButton>Toggle Button</ToggleButton>
  </ThemeProvider>
);

export const Selected = () => (
  <ThemeProvider theme={theme}>
    <ToggleButton isSelected={true}>Toggle Button</ToggleButton>
  </ThemeProvider>
);

import * as React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../../../../../../apps/web/src/muiTheme';

import { ToggleButtonGroup } from './ToggleButtonGroup';

export default {
  component: ToggleButtonGroup,
  title: 'ToggleButtonGroup',
};

export const withToggleItems = () => (
  <ThemeProvider theme={theme}>
    <ToggleButtonGroup
      toggleItems={[
        { name: 'Item #1', active: false },
        { name: 'Item #2', active: false },
      ]}
      onToggle={() => console.log('toggle toggled')}
    />
  </ThemeProvider>
);

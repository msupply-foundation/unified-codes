import * as React from 'react';
import theme from '../../muiTheme';
import { ThemeProvider } from '@material-ui/core/styles';

import { EntityTypeFilter } from './EntityTypeFilter';

export default { title: 'EntityTypeFilter' };

export const withNoProps = () => {
  return (
    <ThemeProvider theme={theme}>
      <EntityTypeFilter />
    </ThemeProvider>
  );
};

import * as React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../../../../../../apps/web/src/muiTheme';

import { EntityTypeFilter } from './EntityTypeFilter';

export default {
  component: EntityTypeFilter,
  title: 'EntityTypeFilter',
};

export const withNoProps = () => (
  <ThemeProvider theme={theme}>
    <EntityTypeFilter />
  </ThemeProvider>
);
import * as React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../../../../../../apps/web/src/muiTheme';

import { EntityFilter } from './EntityFilter';

export default {
  component: EntityFilter,
  title: 'EntityFilter',
};

export const withNoProps = () => (
  <ThemeProvider theme={theme}>
    <EntityFilter />
  </ThemeProvider>
);
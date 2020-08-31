import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/core/styles';

import { Footer } from './Footer';
import theme from '../../muiTheme';

export default { title: 'Footer' };

export const withNoProps = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Footer />
      </ThemeProvider>
    </BrowserRouter>
  );
};

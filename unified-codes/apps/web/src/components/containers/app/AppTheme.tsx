import * as React from 'react';

import { ThemeProvider, CssBaseline } from '@unified-codes/ui/styles';

import theme from '../../../styles/theme';

export interface AppThemeProps {
    children: React.ReactChild | React.ReactChildren
}

export type AppTheme = React.FunctionComponent<AppThemeProps>;

export const AppTheme: AppTheme = ({ children }) => (
    <ThemeProvider theme={theme}>
        <CssBaseline>
            {children}
        </CssBaseline>
    </ThemeProvider>
);
 
export default AppTheme;
import * as React from 'react';

import { Box } from '@unified-codes/ui/components';

export interface LoginLayoutProps {
    login: React.ReactElement;
}

export type LoginLayout = React.FunctionComponent<LoginLayoutProps>;

export const LoginLayout: LoginLayout = ({ login }) => (
    <Box>
        {login}
    </Box>
);

export default LoginLayout;

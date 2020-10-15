import * as React from 'react';

import { Box } from '@unified-codes/ui/components';

export interface AppLayoutProps {
  header: React.ReactElement;
  page: React.ReactElement;
  footer: React.ReactElement;
}

export type AppLayout = React.FunctionComponent<AppLayoutProps>;

export const AppLayout: AppLayout = ({ header, page, footer }) => (
  <Box>
    {header}
    {page}
    {footer}
  </Box>
);

export default AppLayout;

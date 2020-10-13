import * as React from 'react';

import { Box } from '@unified-codes/ui/components';
import { withStyles } from '@unified-codes/ui/styles';

export interface AppLayoutProps {
  classes?: {
    root: string;
  };
  header: React.ReactElement;
  page: React.ReactElement;
  footer: React.ReactElement;
}

const styles = () => ({
  root: {
    overflow: 'hidden',
  },
});

export type AppLayout = React.FunctionComponent<AppLayoutProps>;

export const AppLayout: AppLayout = ({ classes, header, page, footer }) => (
  <Box className={classes?.root}>
    {header}
    {page}
    {footer}
  </Box>
);

export default withStyles(styles)(AppLayout);

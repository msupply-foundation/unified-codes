import * as React from 'react';

import { Grid } from '@unified-codes/ui/components';

export interface AboutLayoutProps {
  classes?: {
    root?: string;
    contentContainer?: string;
  };
  content: React.ReactElement;
}

export type AboutLayout = React.FunctionComponent<AboutLayoutProps>;

export const AboutLayout: AboutLayout = ({ classes, content }) => (
  <Grid container className={classes?.root}>
    <Grid container item className={classes?.contentContainer}>
      {content}
    </Grid>
  </Grid>
);

export default AboutLayout;

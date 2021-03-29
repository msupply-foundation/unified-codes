import * as React from 'react';

import { Grid } from '@unified-codes/ui/components';

export interface DetailLayoutProps {
  classes?: {
    root?: string;
    attributeListContainer?: string;
    detailListContainer?: string;
  };
  attributeList: React.ReactElement;
  detailList: React.ReactElement;
}

export type DetailLayout = React.FunctionComponent<DetailLayoutProps>;

export const DetailLayout: DetailLayout = ({ classes, attributeList, detailList }) => (
  <Grid container direction="column" className={classes?.root}>
    <Grid container className={classes?.attributeListContainer}>
      {attributeList}
    </Grid>
    <Grid container className={classes?.detailListContainer}>
      {detailList}
    </Grid>
  </Grid>
);

export default DetailLayout;

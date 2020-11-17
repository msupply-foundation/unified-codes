import * as React from 'react';

import { Grid } from '@unified-codes/ui/components';

export interface DetailLayoutProps {
  classes?: {
    root?: string;
    attributeListContainer?: string;
    childListContainer?: string;
    productContainer?: string;
    propertyListContainer?: string;
  };
  attributeList: React.ReactElement;
  childList: React.ReactElement;
  product: React.ReactElement;
  propertyList: React.ReactElement;
}

export type DetailLayout = React.FunctionComponent<DetailLayoutProps>;

export const DetailLayout: DetailLayout = ({
  classes,
  attributeList,
  childList,
  product,
  propertyList,
}) => (
  <Grid container direction="column" className={classes?.root}>
    <Grid container className={classes?.attributeListContainer}>
      {attributeList}
    </Grid>
    <Grid container className={classes?.childListContainer}>
      {childList}
    </Grid>
    <Grid container className={classes?.productContainer}>
      {product}
    </Grid>
    <Grid container className={classes?.propertyListContainer}>
      {propertyList}
    </Grid>
  </Grid>
);

export default DetailLayout;

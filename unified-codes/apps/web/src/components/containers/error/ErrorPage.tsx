import * as React from 'react';

import { Grid } from '@unified-codes/ui/components';

const CatOnBike = require('../../../assets/cat-on-bike.png');

export interface ErrorPageProps {
  code: string;
}

export type ErrorPage = React.FunctionComponent<ErrorPageProps>;

export const ErrorPage: ErrorPage = ({ code }) => {
  switch (code) {
    case '404':
      return (
        <Grid container style={{ flexDirection: 'column', alignContent: 'center' }}>
          <Grid item style={{ textAlign: 'center' }}>
            <h3>Nothing to see here...</h3>
          </Grid>
          <Grid item>
            <img style={{ maxHeight: 'calc(100vh - 300px)', maxWidth: '100vw ' }} src={CatOnBike} />
          </Grid>
          <Grid item style={{ textAlign: 'center' }}>
            <h3>...are you sure that you're in the right place?</h3>
          </Grid>
        </Grid>
      );
    default:
      return <div>Oops! Something went wrong.</div>;
  }
};

export default ErrorPage;

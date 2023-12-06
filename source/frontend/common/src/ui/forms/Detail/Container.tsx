import React, { FC } from 'react';
import { Grid } from '@mui/material';
import { PropsWithChildrenOnly } from 'frontend/common/src/types';

export const DetailContainer: FC<PropsWithChildrenOnly> = ({ children }) => (
  <Grid container gap={4} padding={4} justifyContent="center">
    {children}
  </Grid>
);

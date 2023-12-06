import React, { PropsWithChildren } from 'react';
import { Grid } from '@mui/material';
interface ModalRowProps {
  margin?: number;
}

export const ModalRow: React.FC<PropsWithChildren<ModalRowProps>> = ({
  children,
  margin,
}) => (
  <Grid container style={{ marginTop: margin, marginBottom: margin }}>
    {children}
  </Grid>
);

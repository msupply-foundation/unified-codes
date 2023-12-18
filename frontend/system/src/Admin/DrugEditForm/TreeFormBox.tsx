import React from 'react';
import { Box } from '@common/ui';

export const TreeFormBox = ({ children }: { children?: React.ReactNode }) => (
  <Box
    sx={{
      marginLeft: '10px',
      paddingLeft: '10px',
      paddingTop: '10px',
      borderLeft: '1px solid black',
    }}
  >
    {children}
  </Box>
);

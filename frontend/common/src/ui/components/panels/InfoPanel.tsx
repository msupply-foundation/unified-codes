import React from 'react';
import { Box, Typography } from '@mui/material';
import { InfoIcon } from '@common/icons';

export const InfoPanel = ({ message }: { message: string }) => (
  <Box
    gap={1}
    padding={1}
    display="flex"
    alignItems="center"
    sx={{
      backgroundColor: 'gray.pale',
    }}
  >
    <InfoIcon fontSize="small" />
    <Typography>{message}</Typography>
  </Box>
);

import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { AlertIcon } from '@common/icons';


export interface AlertPanelProps {
  message: string;
}
export const AlertPanel: FC<AlertPanelProps> = ({
  message,
}) => {
  return (
    <Box
    gap={1}
    padding={1}
    alignItems="center"
    sx={{
      backgroundColor: 'warning.main',
      display: 'flex'
    }}
  >
    <AlertIcon fontSize="small" />
    <Typography>{message}</Typography>
  </Box>
  );
};
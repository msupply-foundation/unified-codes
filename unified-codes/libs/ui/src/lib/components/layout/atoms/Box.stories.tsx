import React from 'react';
import { Box } from './Box';

export default {
  component: Box,
  title: 'Box',
};

export const withNoProps = () => {
  return <Box>Hello Box!</Box>;
};

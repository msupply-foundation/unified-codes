import React from 'react';
import { Box } from './Box';

export default {
  component: Box,
  title: 'Library/Box',
};

export const withNoProps = () => {
  return <Box>Hello Box!</Box>;
};

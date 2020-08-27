import React from 'react';
import { InputAdornment } from './InputAdornment';

export default {
  component: InputAdornment,
  title: 'Library/InputAdornment',
};

export const withNoProps = () => {
  return <InputAdornment position="start" />;
};

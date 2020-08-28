import React from 'react';
import { MenuItem } from './MenuItem';

export default {
  component: MenuItem,
  title: 'MenuItem',
};

export const withNoProps = () => {
  return <MenuItem />;
};

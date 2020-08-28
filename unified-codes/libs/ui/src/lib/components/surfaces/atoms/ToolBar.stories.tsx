import React from 'react';
import { Toolbar } from './Toolbar';

export default {
  component: Toolbar,
  title: 'Toolbar',
};

export const withNoProps = () => {
  return <Toolbar />;
};

import React from 'react';
import { Menu } from './Menu';

export default {
  component: Menu,
  title: 'Library/Menu',
};

export const withNoProps = () => {
  return <Menu open={true} />;
};

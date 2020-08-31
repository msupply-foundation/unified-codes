import React from 'react';
import { Menu } from './Menu';

export default {
  component: Menu,
  title: 'Menu',
};

export const withNoProps = () => {
  return <Menu open={true} />;
};

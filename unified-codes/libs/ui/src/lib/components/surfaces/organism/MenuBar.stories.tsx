/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';

import { MenuBar, MenuItem } from '@unified-codes/ui/components';
import { useToggle } from '@unified-codes/ui/hooks';

export default {
  component: MenuBar,
  title: 'MenuBar',
};

export const withNoProps = () => {
  return <MenuBar open={true} />;
};

export const withControlProps = () => {
  const { isOpen, onClose, onToggle } = useToggle(false);

  return (
    <MenuBar keepMounted open={isOpen} onClick={onToggle} onClose={onClose}>
      <MenuItem onClick={onClose}>Item 1</MenuItem>
      <MenuItem onClick={onClose}>Item 2</MenuItem>
      <MenuItem onClick={onClose}>Item 3</MenuItem>
    </MenuBar>
  );
};

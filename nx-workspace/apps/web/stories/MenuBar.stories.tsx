import * as React from "react";
import { MenuBar, MenuItem } from "../src/components";

export default { title: "MenuBar" };

export const withNoProps = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const onClick = React.useCallback(() => setIsOpen(true), [setIsOpen]);
  const onClose = React.useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <MenuBar keepMounted open={isOpen} onClick={onClick} onClose={onClose}>
      <MenuItem onClick={onClose}>Item 1</MenuItem>
      <MenuItem onClick={onClose}>Item 2</MenuItem>
      <MenuItem onClick={onClose}>Item 3</MenuItem>
    </MenuBar>
  );
};

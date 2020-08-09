import * as React from "react";

import Box from "../../layout/atoms/Box";
import IconButton from "../../inputs/atoms/IconButton";
import Menu, { MenuProps } from "../../navigation/atoms/Menu";
import MenuIcon from "../../icons/atoms/MenuIcon";

export interface MenuBarProps extends Omit<MenuProps, "onClick"> {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export type MenuBar = React.FunctionComponent<MenuBarProps>;

export const MenuBar: MenuBar = ({
  keepMounted,
  open,
  onClick,
  onClose,
  children,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const onClickMenu = React.useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
      if (onClick) onClick(event);
    },
    [onClick]
  );

  return (
    <Box>
      <IconButton onClick={onClickMenu}>
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted={keepMounted}
        open={open}
        onClose={onClose}
      >
        {children}
      </Menu>
    </Box>
  );
};

export default MenuBar;
import * as React from "react";
import { Box, IconButton, Menu, MenuProps, MenuIcon } from "../../atoms";

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

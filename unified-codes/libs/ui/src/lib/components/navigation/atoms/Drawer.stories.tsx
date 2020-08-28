import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Drawer } from './Drawer';
import Button from '@material-ui/core/Button';

const styles = {
  paper: {
    backgroundColor: '#f26532',
    height: 50,
  },
};
const StyledDrawer = withStyles(styles)(Drawer);
export default {
  component: Drawer,
  title: 'Library/Drawer',
};

export const withNoProps = () => {
  return <Drawer open={true} />;
};

export const bottomOrange = () => {
  return <StyledDrawer open={true} anchor="bottom" variant="permanent" />;
};

export const topOrange = () => {
  return <StyledDrawer open={true} anchor="top" variant="permanent" />;
};

export const bottomTemporaryOrange = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Show Drawer
      </Button>
      <StyledDrawer open={open} anchor="bottom" variant="temporary">
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          Hide Drawer
        </Button>
      </StyledDrawer>
    </div>
  );
};

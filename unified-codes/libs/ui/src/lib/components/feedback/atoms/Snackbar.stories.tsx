/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-no-useless-fragment */
import * as React from 'react';

import Alert from './Alert';
import Button from '../../inputs/atoms/Button';
import ClearButton from '../../inputs/molecules/ClearButton';
import Snackbar from './Snackbar';
import { ClearIcon } from '../../icons';

export default {
  component: Snackbar,
  title: 'Snackbar',
};

export const withNoProps = () => {
  return <Snackbar />;
};

export const bottomLeft = () => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={true}
      message="Sample Simple Snackbar"
      action={<React.Fragment></React.Fragment>}
    />
  );
};

export const bottomCenter = () => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={true}
      message="Sample Simple Snackbar"
      action={<React.Fragment></React.Fragment>}
    />
  );
};

export const bottomRight = () => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={true}
      message="Sample Simple Snackbar"
      action={<React.Fragment></React.Fragment>}
    />
  );
};

export const withCloseIcon = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      onClose={() => setOpen(false)}
      message="Sample Snackbar"
      action={
        <React.Fragment>
          <Button color="secondary" size="small" onClick={() => setOpen(false)}>
            close
          </Button>
          <Button
            aria-label="close"
            color="inherit"
            onClick={() => setOpen(false)}
            size="small"
            startIcon={<ClearIcon/>} 
          ></Button>
        </React.Fragment>
      }
    />
  );
};

export const autoClose = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={5000}
      onClose={() => setOpen(false)}
      message="This message will self-close in 5s"
      action={
        <React.Fragment>
          <Button color="secondary" size="small" onClick={() => setOpen(false)}>
            close
          </Button>
          <Button
            aria-label="close"
            color="inherit"
            onClick={() => setOpen(false)}
            size="small"
            startIcon={<ClearIcon/>} 
          ></Button>
        </React.Fragment>
      }
    />
  );
};

export const withAlert = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
      <Alert severity="success" onClose={() => setOpen(false)}>
        Successfully displayed snackbar!
      </Alert>
    </Snackbar>
  );
};

import * as React from "react";
import { Alert, Button, ClearButton, Snackbar } from "../src/components";

export default { title: "Snackbar" };

export const bottomLeft = () => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
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
        vertical: "bottom",
        horizontal: "center",
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
        vertical: "bottom",
        horizontal: "right",
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
        vertical: "bottom",
        horizontal: "center",
      }}
      open={open}
      onClose={() => setOpen(false)}
      message="Sample Snackbar"
      action={
        <React.Fragment>
          <Button color="secondary" size="small" onClick={() => setOpen(false)}>
            CLOSE
          </Button>
          <ClearButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setOpen(false)}
          ></ClearButton>
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
        vertical: "bottom",
        horizontal: "center",
      }}
      open={open}
      autoHideDuration={5000}
      onClose={() => setOpen(false)}
      message="This message will self-close in 5s"
      action={
        <React.Fragment>
          <Button color="secondary" size="small" onClick={() => setOpen(false)}>
            CLOSE
          </Button>
          <ClearButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setOpen(false)}
          ></ClearButton>
        </React.Fragment>
      }
    />
  );
};

export const withAlert = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={() => setOpen(false)}
    >
      <Alert severity="success" onClose={() => setOpen(false)}>
        Succesfully displayed snackbar!
      </Alert>
    </Snackbar>
  );
};

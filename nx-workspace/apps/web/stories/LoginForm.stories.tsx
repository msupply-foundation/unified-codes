import * as React from "react";
import { Dialog, DialogContent, LoginForm } from "../src/components";

export default { title: "LoginForm" };

export const withDialog = () => (
  <Dialog open={true}>
    <DialogContent dividers>
      <LoginForm />
    </DialogContent>
  </Dialog>
);

import React from 'react';

import Dialog from '../../feedback/atoms/Dialog';
import DialogContent from '../../feedback/atoms/DialogContent';
import LoginForm from './LoginForm';

export default {
  component: LoginForm,
  title: 'LoginForm',
};

export const primary = () => {
  return <LoginForm />;
};

export const withDialog = () => (
  <Dialog open={true}>
    <DialogContent dividers>
      <LoginForm />
    </DialogContent>
  </Dialog>
);

import React from 'react';
import { Dialog } from './Dialog';

export default {
  component: Dialog,
  title: 'Library/Dialog',
};

export const withNoProps = () => <Dialog open={true} />;

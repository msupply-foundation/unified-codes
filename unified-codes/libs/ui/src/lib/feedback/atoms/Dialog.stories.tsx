import React from 'react';
import { Dialog } from './Dialog';

export default {
  component: Dialog,
  title: 'Dialog',
};

export const primary = () => <Dialog open={true} />;

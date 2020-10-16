import React from 'react';
import { Backdrop } from './Backdrop';

export default {
  component: Backdrop,
  title: 'Backdrop',
};

export const open = () => <Backdrop open />;
export const closed = () => <Backdrop open={false} />;

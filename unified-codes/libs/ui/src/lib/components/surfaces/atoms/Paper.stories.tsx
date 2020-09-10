import React from 'react';
import { Paper } from './Paper';

export default {
  component: Paper,
  title: 'Library/Paper',
};

export const withNoProps = () => {
  return <Paper>Nothing to see here</Paper>;
};

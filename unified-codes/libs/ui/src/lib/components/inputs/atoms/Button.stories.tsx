import React from 'react';

import Button from './Button';
import ClearIcon from '../../icons/atoms/ClearIcon';
import SearchIcon from '../../icons/atoms/SearchIcon';

export default {
  component: Button,
  title: 'Button',
};

export const primary = () => {
  return <Button />;
};

export const withClearIcon = () => {
  return <Button startIcon={<ClearIcon />} />;
};

export const withSearchIcon = () => {
  return <Button startIcon={<SearchIcon />} />;
};
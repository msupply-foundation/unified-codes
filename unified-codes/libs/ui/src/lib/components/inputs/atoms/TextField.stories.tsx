import React from 'react';

import ClearIcon from '../../icons/atoms/ClearIcon';
import InputAdornment from './InputAdornment';
import SearchIcon from '../../icons/atoms/SearchIcon';
import TextField from './TextField';

export default {
  component: TextField,
  title: 'TextField',
};

export const withNoProps = () => {
  return <TextField />;
};

export const withClearIcon = () => (
  <TextField
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <ClearIcon />
        </InputAdornment>
      ),
    }}
  />
);
export const withSearchIcon = () => (
  <TextField
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
  />
);

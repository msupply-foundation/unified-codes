import React from 'react';
import { MenuItem, Option, Select } from '@common/ui';

export const CategoryDropdown = ({
  value,
  options,
  disabled,
  onChange,
  getOptionDisabled,
}: {
  value: string;
  options: Option[];
  disabled?: boolean;
  onChange: (value: string) => void;
  getOptionDisabled: (o: Option) => boolean;
}) => (
  <Select
    autoFocus
    disabled={disabled}
    value={value}
    onChange={e => onChange(e.target.value)}
    options={options}
    renderOption={(option: Option) => (
      <MenuItem
        key={option.value}
        value={option.value}
        disabled={getOptionDisabled(option)}
      >
        {option.label}
      </MenuItem>
    )}
    sx={{ width: '100%' }}
  />
);

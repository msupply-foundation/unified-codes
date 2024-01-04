import React from 'react';
import {
  DeleteIcon,
  IconButton,
  InputAdornment,
  MenuItem,
  Option,
  Select,
} from '@common/ui';
import { useTranslation } from '@common/intl';

export const CategoryDropdown = ({
  value,
  options,
  disabled,
  onChange,
  getOptionDisabled,
  showDeleteButton = true,
  onDelete,
}: {
  value: string;
  options: Option[];
  disabled?: boolean;
  onChange: (value: string) => void;
  getOptionDisabled: (o: Option) => boolean;
  showDeleteButton?: boolean;
  onDelete: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
  const t = useTranslation('system');
  return (
    <>
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
      {!disabled && showDeleteButton && (
        <IconButton
          label={t('label.delete')}
          icon={<DeleteIcon />}
          onClick={onDelete}
        />
      )}
    </>
  );
};

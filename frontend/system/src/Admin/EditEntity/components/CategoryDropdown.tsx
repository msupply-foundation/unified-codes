import React from 'react';
import { DeleteIcon, IconButton, MenuItem, Option, Select } from '@common/ui';
import { useTranslation } from '@common/intl';
import { Entity } from '../types';

export const CategoryDropdown = <T extends Entity>({
  options,
  entity,
  siblings,
  disabled,
  showDeleteButton = true,
  onUpdate,
  onDelete,
}: {
  options: Option[];
  entity: T;
  siblings: T[];
  disabled?: boolean;
  showDeleteButton?: boolean;
  onUpdate: (updated: T, list: T[]) => void;
  onDelete: (updated: T, list: T[]) => void;
}) => {
  const t = useTranslation('system');

  if (!options.find(o => o.value === entity.name)) {
    options.push({ label: entity.name, value: entity.name });
  }

  const getOptionDisabled = (o: Option) =>
    !!siblings.find(n => n.name === o.value);

  return (
    <>
      <Select
        autoFocus
        disabled={disabled}
        value={entity.name}
        onChange={e => onUpdate({ ...entity, name: e.target.value }, siblings)}
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
          onClick={() => onDelete(entity, siblings)}
        />
      )}
    </>
  );
};

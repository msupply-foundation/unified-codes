import React from 'react';
import { useTranslation } from '@common/intl';
import { BasicTextInput, DeleteIcon, IconButton } from '@common/ui';
import { Entity } from '../types';

export const NameEditField = ({
  value,
  label,
  disabled,
  siblings,
  showDeleteButton = true,
  onChange,
  onDelete,
}: {
  value: string;
  label: string;
  disabled: boolean;
  siblings: Entity[];
  showDeleteButton?: boolean;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onDelete: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
  const t = useTranslation('system');

  const siblingNames = siblings.map(node => node.name);

  const isDuplicate = siblingNames.some(
    (name, idx) => name === value && siblingNames.indexOf(name) !== idx
  );

  return (
    <>
      <BasicTextInput
        autoFocus
        disabled={disabled}
        value={value}
        onChange={onChange}
        fullWidth
        error={!value || isDuplicate}
        helperText={
          !value
            ? t('error.required', { field: label })
            : isDuplicate
            ? t('error.duplicate')
            : undefined
        }
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

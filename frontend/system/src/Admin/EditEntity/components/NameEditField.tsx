import React from 'react';
import { useTranslation } from '@common/intl';
import { BasicTextInput, DeleteIcon, IconButton } from '@common/ui';
import { Entity } from '../types';

export const NameEditField = <T extends Entity>({
  label,
  entity,
  siblings,
  showDeleteButton = true,
  isDisabled,
  onUpdate,
  onDelete,
}: {
  label: string;
  entity: T;
  siblings: T[];
  showDeleteButton?: boolean;
  isDisabled: (id: string) => boolean;
  onUpdate: (updated: T, list: T[]) => void;
  onDelete: (updated: T, list: T[]) => void;
}) => {
  const t = useTranslation('system');

  const siblingNames = siblings.map(node => node.name);
  const isDuplicate = siblingNames.some(
    (name, idx) => name === entity.name && siblingNames.indexOf(name) !== idx
  );

  const disabled = isDisabled(entity.id);

  return (
    <>
      <BasicTextInput
        autoFocus
        disabled={disabled}
        value={entity.name}
        onChange={e => onUpdate({ ...entity, name: e.target.value }, siblings)}
        fullWidth
        error={!entity.name || isDuplicate}
        helperText={
          !entity.name
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
          onClick={() => onDelete(entity, siblings)}
        />
      )}
    </>
  );
};

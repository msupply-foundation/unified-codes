import React from 'react';
import { useTranslation } from '@common/intl';
import {
  BasicTextInput,
  DeleteIcon,
  IconButton,
  InputAdornment,
} from '@common/ui';

export const NameEditField = ({
  value,
  label,
  disabled,
  showDeleteButton = true,
  onChange,
  onDelete,
}: {
  value: string;
  label: string;
  disabled: boolean;
  showDeleteButton?: boolean;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onDelete: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
  const t = useTranslation('system');
  return (
    <>
      <BasicTextInput
        autoFocus
        disabled={disabled}
        value={value}
        onChange={onChange}
        fullWidth
        error={!value}
        helperText={!value && t('error.required', { field: label })}
        InputProps={{
          endAdornment: !disabled && showDeleteButton && (
            <InputAdornment position="end"></InputAdornment>
          ),
        }}
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

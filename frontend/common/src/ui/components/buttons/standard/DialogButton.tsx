import React from 'react';
import { LocaleKey, useTranslation } from '@common/intl';
import {
  ArrowRightIcon,
  CheckIcon,
  CloseIcon,
  DownloadIcon,
} from '@common/icons';
import { ButtonWithIcon } from './ButtonWithIcon';

type DialogButtonVariant =
  | 'cancel'
  | 'next'
  | 'ok'
  | 'import'
  | 'export'
  | 'done';

interface DialogButtonProps {
  disabled?: boolean;
  onClick: (
    event?:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => void;
  variant: DialogButtonVariant;
  autoFocus?: boolean;
}

const getButtonProps = (
  variant: DialogButtonVariant
): {
  icon: JSX.Element;
  labelKey: LocaleKey;
  variant: 'outlined' | 'contained';
} => {
  switch (variant) {
    case 'cancel':
      return {
        icon: <CloseIcon />,
        labelKey: 'button.cancel',
        variant: 'outlined',
      };
    case 'ok':
      return {
        icon: <CheckIcon />,
        labelKey: 'button.ok',
        variant: 'contained',
      };
    case 'next':
      return {
        icon: <ArrowRightIcon />,
        labelKey: 'button.ok-and-next',
        variant: 'contained',
      };
    case 'import':
      return {
        icon: <CheckIcon />,
        labelKey: 'button.import',
        variant: 'contained',
      };
    case 'export':
      return {
        icon: <DownloadIcon />,
        labelKey: 'button.export',
        variant: 'contained',
      };
    case 'done':
      return {
        icon: <CheckIcon />,
        labelKey: 'button.done',
        variant: 'contained',
      };
  }
};

export const DialogButton: React.FC<DialogButtonProps> = ({
  onClick,
  variant,
  disabled = false,
  autoFocus = false,
}) => {
  const t = useTranslation('common');
  const { variant: buttonVariant, icon, labelKey } = getButtonProps(variant);

  return (
    <ButtonWithIcon
      autoFocus={autoFocus}
      color="secondary"
      disabled={disabled}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onClick(e);
        }
      }}
      Icon={icon}
      variant={buttonVariant}
      label={t(labelKey)}
      sx={
        disabled
          ? {
              '& svg': { color: 'gray.main' },
              fontSize: '12px',
            }
          : {}
      }
    />
  );
};

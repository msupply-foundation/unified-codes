import React from 'react';
import { ButtonProps, Tooltip } from '@mui/material';
import { ShrinkableBaseButton } from './ShrinkableBaseButton';
import { useIsScreen } from '@common/hooks';

export interface ButtonWithIconProps extends ButtonProps {
  title?: string;
  Icon: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  shouldShrink?: boolean;
  variant?: 'outlined' | 'contained';
  color?: 'primary' | 'secondary';
  disabled?: boolean;
  shrinkThreshold?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  title,
  label,
  onClick,
  Icon,
  shouldShrink = true,
  variant = 'outlined',
  color = 'primary',
  disabled,
  shrinkThreshold = 'md',
  ...buttonProps
}) => {
  const isShrinkThreshold = useIsScreen(shrinkThreshold);

  if (!title) {
    title = label;
  }

  // On small screens, if the button shouldShrink, then
  // only display a centered icon, with no text.
  const shrink = isShrinkThreshold && shouldShrink;
  const startIcon = shrink ? null : Icon;
  const centeredIcon = shrink ? Icon : null;
  const text = shrink ? null : label;

  return (
    <Tooltip title={title}>
      <span>
        <ShrinkableBaseButton
          disabled={disabled}
          shrink={shrink}
          onClick={onClick}
          variant={variant}
          color={color}
          size="small"
          startIcon={startIcon}
          aria-label={label}
          {...buttonProps}
        >
          {centeredIcon}
          {text}
        </ShrinkableBaseButton>
      </span>
    </Tooltip>
  );
};

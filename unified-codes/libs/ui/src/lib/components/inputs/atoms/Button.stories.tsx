import React from 'react';

import AddIcon from '../../icons/atoms/AddIcon';
import Button from './Button';
import CheckCircleIcon from '../../icons/atoms/CheckCircleIcon';
import ClearIcon from '../../icons/atoms/ClearIcon';
import SearchIcon from '../../icons/atoms/SearchIcon';

export default {
  component: Button,
  title: 'Button',
};

export const withNoProps = () => <Button />;

export const withText = () => <Button>Button</Button>;

export const withClearIcon = () => <Button startIcon={<ClearIcon />} />;

export const withSearchIcon = () => <Button startIcon={<SearchIcon />} />;

export const withCheckCircleIcon = () => <Button startIcon={<CheckCircleIcon />} />;

export const withAddIcon = () => <Button startIcon={<AddIcon />} />;

export const withToggleProps = () => {
  const [isSelected, setIsSelected] = React.useState<boolean>(false);

  const label = React.useMemo(() => (isSelected ? 'Selected button' : 'Unselected button'), [
    isSelected,
  ]);
  const icon = React.useMemo(() => (isSelected ? <CheckCircleIcon /> : <AddIcon />), [isSelected]);

  const onClick = React.useCallback(() => setIsSelected((isSelected) => !isSelected), [
    setIsSelected,
  ]);

  return (
    <Button startIcon={icon} onClick={onClick}>
      {label}
    </Button>
  );
};

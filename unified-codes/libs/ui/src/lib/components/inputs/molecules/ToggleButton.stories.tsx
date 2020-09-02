import React from 'react';

import ToggleButton from './ToggleButton';

export default {
  component: ToggleButton,
  title: 'ToggleButton',
};

export const Unselected = () => {
  return <ToggleButton>Toggle Button</ToggleButton>;
};

export const Selected = () => {
  return <ToggleButton isSelected={true}>Toggle Button</ToggleButton>;
};

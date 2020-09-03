import React from 'react';

import ToggleButton from './ToggleButton';

export default {
  component: ToggleButton,
  title: 'ToggleButton',
};

export const Unselected = () => (
  <ToggleButton>Toggle Button</ToggleButton>
);

export const Selected = () => (
  <ToggleButton isSelected={true}>Toggle Button</ToggleButton>
);

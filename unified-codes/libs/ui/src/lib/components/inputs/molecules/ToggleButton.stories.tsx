import React from 'react';

import ToggleButton from './ToggleButton';

export default {
  component: ToggleButton,
  title: 'ToggleButton',
};

export const withNoProps = () => {
  return <ToggleButton>Toggle Button</ToggleButton>;
};

export const selected = () => {
  return <ToggleButton isSelected={true}>Toggle Button</ToggleButton>;
};





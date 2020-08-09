import React from 'react';

import ClearIcon from '../../icons/atoms/ClearIcon';
import IconInput from './IconInput';
import SearchIcon from '../../icons/atoms/SearchIcon';
import SvgIcon from '../../icons/atoms/SvgIcon';

export default {
  component: IconInput,
  title: 'IconInput',
};

export const primary = () => {
  return <IconInput icon={SvgIcon}/>;
};

export const withClearIcon = () => {
  return <IconInput icon={ClearIcon}/>;
};

export const withSearchIcon = () => {
  return <IconInput icon={SearchIcon}/>;
};

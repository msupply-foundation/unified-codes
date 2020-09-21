import * as React from 'react';

import Button, { ButtonProps } from '../atoms/Button';
import SearchIcon from '../../icons/atoms/SearchIcon';

export type SearchButtonProps = ButtonProps;

export type SearchButton = React.FunctionComponent<SearchButtonProps>;

export const SearchButton: SearchButton = (props: SearchButtonProps) => {
  const { classes, ...otherProps } = props;
  return <Button classes={{ root: classes?.root }} startIcon={<SearchIcon />} {...otherProps}></Button>;
}

export default SearchButton;

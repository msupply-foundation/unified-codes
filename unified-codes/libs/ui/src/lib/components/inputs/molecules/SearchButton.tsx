import * as React from 'react';

import Button, { ButtonProps } from '../atoms/Button';
import SearchIcon from '../../icons/atoms/SearchIcon';

export type SearchButtonProps = ButtonProps;

export type SearchButton = React.FunctionComponent<SearchButtonProps>;

export const SearchButton: SearchButton = (props: SearchButtonProps) => (
  <Button startIcon={<SearchIcon />} {...props}></Button>
);

export default SearchButton;

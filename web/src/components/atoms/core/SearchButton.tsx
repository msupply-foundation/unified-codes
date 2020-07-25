import * as React from 'react';
import { Button, ButtonProps } from './Button';
import { SearchIcon } from './SearchIcon';

export interface SearchButtonProps extends ButtonProps {};

export type SearchButton = React.FunctionComponent<SearchButtonProps>;

export const SearchButton: SearchButton = (props: SearchButtonProps) => <Button startIcon={<SearchIcon/>} {...props}/>;
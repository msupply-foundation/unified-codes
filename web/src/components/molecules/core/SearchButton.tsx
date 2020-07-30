import * as React from 'react';
import { Button, ButtonProps, SearchIcon } from '../../atoms';

export interface SearchButtonProps extends ButtonProps {};

export type SearchButton = React.FunctionComponent<SearchButtonProps>;

export const SearchButton: SearchButton = (props: SearchButtonProps) => <Button startIcon={<SearchIcon/>} {...props}/>;
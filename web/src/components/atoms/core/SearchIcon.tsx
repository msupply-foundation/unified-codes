import * as React from 'react';
import { Search } from '@material-ui/icons';

export interface SearchIconProps {};

export type SearchIcon = React.FunctionComponent<SearchIconProps>;

export const SearchIcon: SearchIcon = () => <Search/>;
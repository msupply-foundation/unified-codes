import React from 'react';

import { Search as MSearch } from "@material-ui/icons";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SearchIconProps {};

export type SearchIcon = React.FunctionComponent<SearchIconProps>;

export const SearchIcon: SearchIcon = props => <MSearch {...props}></MSearch>;

export default SearchIcon;
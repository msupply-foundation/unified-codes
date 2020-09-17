import * as React from 'react';

export interface SearchResultProps {

}

export type SearchResults = React.FunctionComponent<SearchResultProps>;

export const SearchResults : SearchResults = () => {
  return <div>A search results page</div>
};

export default SearchResults;
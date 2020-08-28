/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';

import SearchBar from './SearchBar';

export default {
  component: SearchBar,
  title: 'Library/SearchBar',
};

export const withNoProps = () => {
  const [input] = React.useState('');
  return <SearchBar input={input} />;
};

export const withVoidControlProps = () => {
  const returnVoid = () => null;
  const [input] = React.useState('');
  return (
    <SearchBar input={input} onChange={returnVoid} onClear={returnVoid} onSearch={returnVoid} />
  );
};

export const withControlProps = () => {
  const [input, setInput] = React.useState('');

  const updateInput = React.useCallback((value) => setInput(value), []);
  const resetInput = React.useCallback(() => setInput(''), []);
  const alertInput = React.useCallback(() => alert(input), [input]);

  return (
    <SearchBar input={input} onChange={updateInput} onClear={resetInput} onSearch={alertInput} />
  );
};

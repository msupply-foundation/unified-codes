import * as React from 'react';
import { SearchBar } from '../src/components';
import { OnChangeHandler, OnClickHandler } from 'types';

export default { title: 'SearchBar' };

export const withNoProps = () => {
    return <SearchBar/>;
}

export const withControlProps = () => {
    const [input, setInput] = React.useState("");
    const onChange: OnChangeHandler = React.useCallback(event => setInput(event.target.value), []);
    const onClear: OnClickHandler = React.useCallback(() => setInput(""), []);
    const onSearch: OnClickHandler = React.useCallback(() => alert(input), [input]);
    return <SearchBar input={input} onChange={onChange} onClear={onClear} onSearch={onSearch}/>;
}
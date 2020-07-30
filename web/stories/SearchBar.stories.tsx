import * as React from 'react';
import { SearchBar } from '../src/components';
import { InputChangeElement, OnChange, OnClick, ButtonClickElement } from 'types';

export default { title: 'SearchBar' };

export const withNoProps = () => {
    return <SearchBar/>;
}

export const withControlProps = () => {
    const [input, setInput] = React.useState("");
    const onChange: OnChange<InputChangeElement> = React.useCallback(event => setInput(event.target.value), []);
    const onClear: OnClick<ButtonClickElement> = React.useCallback(() => setInput(""), []);
    const onSearch: OnClick<ButtonClickElement> = React.useCallback(() => alert(input), [input]);
    return <SearchBar input={input} onChange={onChange} onClear={onClear} onSearch={onSearch}/>;
}
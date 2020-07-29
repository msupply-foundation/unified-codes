import * as React from 'react';
import { styled } from '@material-ui/core/styles';
import { ClearIcon, Container } from '../../atoms';
import { InputField, SearchButton } from '../../molecules';
import { OnChangeHandler, OnClickHandler } from '../../../types';
import { flexStyle, flexRowStyle } from '../../../styles';

export interface SearchBarProps {
    input?: string;
    onChange?: OnChangeHandler;
    onClear?: OnClickHandler;
    onSearch?: OnClickHandler;
  };
  
export type SearchBar = React.FunctionComponent<SearchBarProps>;
  
export const SearchBar: SearchBar = ({ input, onChange, onClear, onSearch, ...other }) => {
    const FlexContainer = React.useMemo(() => styled(({ ...props }) => <Container {...props}/>)(styles.flexContainer), []);
    const FlexInputField = React.useMemo(() => styled(({ ...props }) => <InputField {...props}/>)(styles.flexInputField), []);
    const FlexSearchButton = React.useMemo(() => styled(({ ...props }) => <SearchButton {...props}/>)(styles.flexSearchButton), []);

    return (
        <FlexContainer {...other}>
            <FlexInputField input={input} icon={ClearIcon} onChange={onChange} onClick={onClear}/>
            <FlexSearchButton onClick={onSearch}/>
        </FlexContainer>
    );
};

const styles = {
    flexContainer: flexRowStyle,
    flexInputField: { ...flexStyle, flexGrow: 95 },
    flexSearchButton: { ...flexStyle, flexGrow: 5 },
};
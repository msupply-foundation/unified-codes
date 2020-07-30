import * as React from "react";
import { EntityTable, Container, SearchBar } from '../components';
import { Entity } from '../types';
import { flexColumnStyle } from "../styles";
import { styled } from "@material-ui/core/styles";

const entities: Entity[] = [
    {
        "code": "QFWR9789",
        "description": "Amoxicillin",
        "type": "medicinal_product",
    },
    {
        "code": "GH89P98W",
        "description": "Paracetamol",
        "type": "medicinal_product",
    }
];

export const MainPage = () => {  
    const [input, setInput] = React.useState("");
    const [data, setData] = React.useState(entities);

    const resetInput = React.useCallback(() => setInput(""), []);
    const resetData = React.useCallback(() => setData(entities), []);

    const onChange = React.useCallback(event => { setInput(event.target.value) }, []);
    const onClear = React.useCallback(() => { resetInput(); resetData(); }, []);
    const onSearch = React.useCallback(() => {
        if (!input) resetData();
        setData(entities.filter((entity: Entity) => entity.code.toLowerCase().includes(input.toLowerCase()) || entity.description.toLowerCase().includes(input.toLowerCase())));
    }, [input]);
        
    const FlexContainer = React.useMemo(() => styled(({ ...props }) => <Container {...props}/>)(styles.flexContainer), []);

    return (
        <FlexContainer>
            <SearchBar input={input} onChange={onChange} onClear={onClear} onSearch={onSearch}/>
            <EntityTable data={data}/>
        </FlexContainer>
    );
};

const styles = {
    flexContainer: {...flexColumnStyle, margin: '5%' }
} 

export default MainPage;
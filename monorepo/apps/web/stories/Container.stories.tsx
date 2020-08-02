import * as React from 'react';
import { Container } from '../src/components';
import { styled } from '@material-ui/core';
import { flexStyle, flexRowStyle, flexColumnStyle } from '../src/styles';

export default { title: 'Container' };

export const withFlexRow = () => {
    const FlexRowContainer = React.useMemo(() => styled(({ ...props }) => <Container {...props}/>)(styles.rowContainer), []);
    const FlexChildContainer = React.useMemo(() => styled(({ ...props }) => <Container {...props}/>)(styles.childContainer), []);
    return (
        <FlexRowContainer>
            <FlexChildContainer>Child 1</FlexChildContainer>
            <FlexChildContainer>Child 2</FlexChildContainer>
            <FlexChildContainer>Child 3</FlexChildContainer>
        </FlexRowContainer>
    );
}

export const withFlexColumn = () => {
    const FlexColumnContainer = React.useMemo(() => styled(({ ...props }) => <Container {...props}/>)(styles.columnContainer), []);
    const FlexChildContainer = React.useMemo(() => styled(({ ...props }) => <Container {...props}/>)(styles.childContainer), []);
    return (
        <FlexColumnContainer>
            <FlexChildContainer>Child 1</FlexChildContainer>
            <FlexChildContainer>Child 2</FlexChildContainer>
            <FlexChildContainer>Child 3</FlexChildContainer>
        </FlexColumnContainer>
    );
}

const styles = {
    rowContainer: flexRowStyle,
    columnContainer: flexColumnStyle,
    childContainer: {
        ...flexStyle,
        borderStyle: 'dotted',
        borderWidth: 'thin',
    }
}
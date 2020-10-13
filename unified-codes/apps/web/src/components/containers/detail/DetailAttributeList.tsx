import * as React from 'react';
import { connect } from 'react-redux';

import { Grid, Typography, List, ListItem, ListItemText } from '@unified-codes/ui/components'

import { IState } from '../../../types';
import { DetailSelectors } from '../../../selectors';

interface DetailAttributeListProps {
    classes?: { root?: string };
    code?: string;
    description?: string;
    type?: string;
}

export type DetailAttributeList = React.FunctionComponent<DetailAttributeListProps>;

const DetailAttributeListComponent: DetailAttributeList = ({ classes, code, description, type }) => {
    const nameField = `Name: ${description}`;
    const codeField = `Code: ${code}`;
    const typeField = `Type: ${type}`;

    return (
        <Grid container classes={{ root: classes?.root }} direction="column">
            <List>
                <ListItem>
                    <ListItemText>
                        <Typography>{nameField}</Typography>
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText>
                        <Typography>{codeField}</Typography>
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText>
                        <Typography>{typeField}</Typography>  
                    </ListItemText>
                </ListItem>
            </List>
        </Grid>
    )
}

const mapStateToProps = (state: IState) => {
    const code = DetailSelectors.selectCode(state);
    const description = DetailSelectors.selectDescription(state);
    const type = DetailSelectors.selectType(state);
    return { code, description, type };  
}

export const DetailAttributeList = connect(mapStateToProps)(DetailAttributeListComponent);

export default DetailAttributeList;
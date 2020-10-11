import * as React from 'react';
import { connect } from 'react-redux';

import { IProperty } from '@unified-codes/data';
import { Grid, Typography, List, ListItem, ListItemText } from '@unified-codes/ui/components'

import { IState } from '../../../types';
import { DetailSelectors } from '../../../selectors';

interface DetailPropertyListProps {
    classes?: { root?: string };
    properties?: IProperty[];
}

export type DetailPropertyList = React.FunctionComponent<DetailPropertyListProps>;

const DetailPropertyListComponent: DetailPropertyList = ({ classes }) => {
    const propertiesField = 'Properties: N/A';

    // TODO: render entity property list.
    return (
        <Grid container classes={{ root: classes?.root }} direction="column">
            <List>
                <ListItem>
                    <ListItemText>
                        <Typography>{propertiesField}</Typography>
                    </ListItemText>
                </ListItem>
            </List>
        </Grid>
    )
}

const mapStateToProps = (state: IState) => {
    const properties = DetailSelectors.selectProperties(state);
    return { properties };  
}


export const DetailPropertyList = connect(mapStateToProps)(DetailPropertyListComponent);

export default DetailPropertyList;
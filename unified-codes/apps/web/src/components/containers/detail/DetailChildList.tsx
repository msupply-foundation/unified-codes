import * as React from 'react';
import { connect } from 'react-redux';

import { IEntity } from '@unified-codes/data';
import { Grid, Typography, List, ListItem, ListItemText } from '@unified-codes/ui/components'

import { IState } from '../../../types';
import { DetailSelectors } from '../../../selectors';


interface DetailChildListProps {
    classes?: { root?: string };
    children?: IEntity[];
}

export type DetailDesciption = React.FunctionComponent<DetailChildListProps>;

const DetailChildListComponent: DetailDesciption = ({ classes }) => {
    const childrenField = 'Children: N/A';

    // TODO: render entity children list.
    return (
        <Grid container classes={{ root: classes?.root }} direction="column">
            <List>
                <ListItem>
                    <ListItemText>
                        <Typography>{childrenField}</Typography>
                    </ListItemText>
                </ListItem>
            </List>
        </Grid>
    );
}

const mapStateToProps = (state: IState) => {
    const children = DetailSelectors.selectChildren(state);
    return { children };  
}

export const DetailChildList = connect(mapStateToProps)(DetailChildListComponent);

export default DetailChildList;
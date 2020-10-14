import * as React from 'react';
import { connect } from 'react-redux';

import { IEntity, IProperty } from '@unified-codes/data';
import { List, ListItem, ListItemText } from '@unified-codes/ui/components';
import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import DetailPropertyListItem from './DetailPropertyListItem';

import { IState } from '../../../types';
import { DetailSelectors } from '../../../selectors';
import { ITheme } from '../../../styles';

const useStyles = makeStyles((_: ITheme) => createStyles({
    root: {
        width: '100%',
    }
}));

export interface DetailPropertyListProps {
    entity: IEntity;
}

export type DetailPropertyList = React.FunctionComponent<DetailPropertyListProps>;

export const DetailPropertyListComponent: DetailPropertyList = ({ entity }) => {
    const classes = useStyles();

    const { properties } = entity ?? {};
    const { length: propertyCount } = properties ?? [];

    if (!propertyCount) return null;

    return (
        <List className={classes.root}>
            <DetailPropertyListItem description="Properties" properties={properties} />
        </List>
    );
};

const mapStateToProps = (state: IState) => {
    const entity = DetailSelectors.selectEntity(state);
    return { entity };  
}

export const DetailPropertyList = connect(mapStateToProps)(DetailPropertyListComponent);

export default DetailPropertyList;
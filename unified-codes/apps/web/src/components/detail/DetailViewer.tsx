import * as React from 'react';
import { connect } from 'react-redux';

import { Grid, Typography } from '@unified-codes/ui'
import { IEntity, IProperty } from '@unified-codes/data';

import { IState } from '../../types';

interface IEntityViewerProps {
    classes?: { root?: string };
    code: string;
    description: string;
    children?: IEntity[];
    properties?: IProperty[];
}

type EntityViewer = React.FunctionComponent<IEntityViewerProps>;

const EntityViewer: EntityViewer = ({ classes, code, description, children, properties }) => {
    const nameField = `Name: ${description}`;
    const codeField = `Code: ${code}`;
    const childrenField = 'Children';
    const propertiesField = 'Properties';

    return (
        <Grid container classes={{ root: classes?.root }} direction="column">
            <Typography>{nameField}</Typography>
            <Typography>{codeField}</Typography>
            <Typography>{childrenField}</Typography>
            <Typography>{propertiesField}</Typography>
        </Grid>
    )
}

const mapStateToProps = (_: IState) => {
    return {
        code: 'Hello Kat!',
        description: 'How are you?'
    };
}

export const DetailViewer = connect(mapStateToProps)(EntityViewer);

export default DetailViewer;
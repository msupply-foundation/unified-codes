import * as React from 'react';
import { connect } from 'react-redux';

import { Button, Grid, Typography } from '@unified-codes/ui'
import { IEntity, IProperty } from '@unified-codes/data';

import { IState, ITheme } from '../../types';
import { DetailSelectors } from '../../selectors';
import { withStyles } from '../../styles';
import { ExplorerToggleButton } from '../explorer';

const styles = (theme: ITheme) => ({
    root: {
        width: '100%',
    },
    bottomContainer: {
        backgroundColor: theme.palette.background.default,
        margin: '-20px auto 0 auto',
        maxHeight: '100%',
        maxWidth: 900,
        width: '60%',
        borderRadius: 5,
    },
    topContainer: {
        backgroundColor: theme.palette.background.footer,
        height: 80,
        paddingBottom: 25,
        justifyContent: 'center',
    },
});

interface IEntityViewerClasses {
    root?: string;
    bottomContainer?: string;
    topContainer?: string;
}

interface IEntityViewerProps {
    classes?: IEntityViewerClasses;
    entity: IEntity;
}

type EntityViewer = React.FunctionComponent<IEntityViewerProps>;

const EntityViewer: EntityViewer = ({ classes, entity }) => {
    const { code, description, children, properties } = entity;

    const nameField = `Name: ${description}`;
    const codeField = `Code: ${code}`;
    const childrenField = `Children: ${children}`;
    const propertiesField = `Properties: ${properties}`;

    return (
        <Grid container classes={{ root: classes?.root }}>
            <Grid container classes={{ root: classes?.topContainer }}></Grid>
            <Grid container classes={{ root: classes?.bottomContainer }} direction="column">
                <Typography variant="h5">{nameField}</Typography>
                <Typography variant="h5">{codeField}</Typography>
                <Typography variant="h5">{childrenField}</Typography>
                <Typography variant="h5">{propertiesField}</Typography>
            </Grid>
        </Grid>

    )
}

const mapStateToProps = (state: IState) => {
    const entity = DetailSelectors.selectEntity(state);
    return { entity };
}

export const DetailViewer = connect(mapStateToProps)(withStyles(styles)(EntityViewer));

export default DetailViewer;
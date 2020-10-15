import * as React from 'react';

import { makeStyles, createStyles } from '@unified-codes/ui/styles';

import { ITheme } from '../../../styles';

const image = require('../../../assets/image/cat_bike.png');

const useStyles = makeStyles((_: ITheme) => createStyles({
    image: {
        maxHeight: 'calc(100vh - 350px)', 
        maxWidth: '100vw',
        padding: '20px 0 20px 0'
    },
}));

export interface ErrorNotFoundCenterProps {}

export type ErrorNotFoundCenter = React.FunctionComponent<ErrorNotFoundCenterProps>;

export const ErrorNotFoundCenter: ErrorNotFoundCenter = () => {
    const classes = useStyles();
    return <img className={classes.image} src={image} />;
};

export default ErrorNotFoundCenter;

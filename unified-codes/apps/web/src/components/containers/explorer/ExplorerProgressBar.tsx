import * as React from 'react';
import { connect } from 'react-redux';

import { Backdrop, CircularProgress } from '@unified-codes/ui/components';
import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import ExplorerProgressCat from './ExplorerProgressCat';

import { IState } from '../../../types';
import { ITheme } from '../../../styles';
import { ExplorerSelectors } from '../../../selectors';

const useStyles = makeStyles((theme: ITheme) => createStyles({
    root: {
        zIndex: theme.zIndex.drawer + 1,
      },
}));

export interface ExplorerProgressBarProps {
    isLoading: boolean;
}

export type ExplorerProgressBar = React.FunctionComponent<ExplorerProgressBarProps>;

export const ExplorerProgressBarComponent: ExplorerProgressBar = ({ isLoading }) => {
    const classes = useStyles();

    // Uncomment to enable cat mode!
    // return <ExplorerProgressCat />;

    return (
        <Backdrop className={classes.root} open={isLoading}>
            <CircularProgress color="inherit" />;
        </Backdrop>
    );
}

const mapStateToProps = (state: IState) => {
    const isLoading = ExplorerSelectors.selectLoading(state);
    return { isLoading };
}

export const ExplorerProgressBar = connect(mapStateToProps)(ExplorerProgressBarComponent);

export default ExplorerProgressBar;
import * as React from 'react';
import { connect } from 'react-redux';

import { Backdrop, CircularProgress } from '@unified-codes/ui/components';
import { createStyles, makeStyles } from '@unified-codes/ui/styles';

import ExplorerProgressCat from './ExplorerProgressCat';

import { IState } from '../../../types';
import { ITheme } from '../../../styles';
import { ExplorerSelectors } from '../../../selectors';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: 'rgba(249, 249, 251, 0.9)',
    },
  })
);

export type ProgressType = 'cat' | 'material-ui' | undefined;

export interface ExplorerProgressBarProps {
  isLoading: boolean;
  type: ProgressType;
}

export type ExplorerProgressBar = React.FunctionComponent<ExplorerProgressBarProps>;

const getProgressIndicator = (type: ProgressType) => {
  switch (type) {
    case 'cat':
      return <ExplorerProgressCat />;
    default:
      return <CircularProgress color="inherit" />;
  }
};

export const ExplorerProgressBarComponent: ExplorerProgressBar = ({ isLoading, type }) => {
  const classes = useStyles();
  const progressIndicator = getProgressIndicator(type);

  return (
    <Backdrop className={classes.root} open={isLoading}>
      {progressIndicator}
    </Backdrop>
  );
};

const mapStateToProps = (state: IState) => {
  const isLoading = ExplorerSelectors.selectLoading(state);
  return { isLoading };
};

export const ExplorerProgressBar = connect(mapStateToProps)(ExplorerProgressBarComponent);

export default ExplorerProgressBar;

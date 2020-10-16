import * as React from 'react';
import { batch, connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import { makeStyles, createStyles } from '@unified-codes/ui/styles';

import ExplorerProgressBar from './ExplorerProgressBar';
import ExplorerTable from './ExplorerTable';
import ExplorerToggleBar from './ExplorerToggleBar';
import ExplorerSearchBar from './ExplorerSearchBar';
import ExplorerLayout from '../../layout/ExplorerLayout';

import { IState, IExplorerRouteParams } from '../../../types';
import { ExplorerActions, IExplorerAction } from '../../../actions';
import { ITheme } from '../../../styles';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      width: '100%',
    },
    tableContainer: {
      backgroundColor: theme.palette.background.default,
      margin: '0 auto 0 auto',
      maxHeight: '100%',
      maxWidth: 900,
      width: '60%',
      borderRadius: 5,
    },
    searchBarContainer: {
      backgroundColor: theme.palette.background.default,
      margin: '-20px auto 0 auto',
      maxWidth: 900,
      width: '60%',
      borderRadius: 5,
    },
    toggleBarContainer: {
      backgroundColor: theme.palette.background.footer,
      paddingBottom: 24,
    },
  })
);

export interface ExplorerPageProps {
  onMount?: (parameters: IExplorerRouteParams) => void;
  onUnmount?: (parameters: IExplorerRouteParams) => void;
}

export type ExplorerPage = React.FunctionComponent<ExplorerPageProps>;

export const ExplorerPageComponent: ExplorerPage = ({
  onMount = ({}) => null,
  onUnmount = ({}) => null,
}) => {
  const classes = useStyles();
  const params = useParams();

  React.useEffect(() => {
    onMount && onMount(params);
    return () => onUnmount && onUnmount(params);
  }, []);

  return (
    <ExplorerLayout
      classes={classes}
      table={<ExplorerTable />}
      toggleBar={<ExplorerToggleBar />}
      searchBar={<ExplorerSearchBar />}
      progressBar={<ExplorerProgressBar />}
    />
  );
};

const mapDispatchToProps = (dispatch: React.Dispatch<IExplorerAction>) => {
  const onMount = () => dispatch(ExplorerActions.updateEntities());
  const onUnmount = () => {
    batch(() => {
      dispatch(ExplorerActions.resetEntities());
      dispatch(ExplorerActions.resetFilterBy());
      dispatch(ExplorerActions.resetInput());
      dispatch(ExplorerActions.resetOrderBy());
      dispatch(ExplorerActions.resetOrderDesc());
      dispatch(ExplorerActions.resetPage());
      dispatch(ExplorerActions.resetRowsPerPage());
    });
  };

  return { onMount, onUnmount };
};

const mapStateToProps = (_: IState) => ({});

export const ExplorerPage = connect(mapStateToProps, mapDispatchToProps)(ExplorerPageComponent);

export default ExplorerPage;

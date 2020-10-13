import * as React from 'react';
import { batch, connect } from 'react-redux';

import { makeStyles, createStyles } from '@unified-codes/ui/styles';

import ExplorerTable from './ExplorerTable';
import ExplorerToggleBar from './ExplorerToggleBar';
import ExplorerSearchBar from './ExplorerSearchBar';
import ExplorerLayout from '../../layout/ExplorerLayout';

import { IState } from '../../../types';
import { ExplorerActions, IExplorerAction } from '../../../actions';
import { ITheme } from '../../../styles';
import { ExplorerSelectors } from 'apps/web/src/selectors';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      width: '100%',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    tableContainer: {
      backgroundColor: theme.palette.background.default,
      borderRadius: 5,
      margin: '0 auto 0 auto',
      maxHeight: '100%',
      maxWidth: 900,
      width: '60%',
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
  loading?: boolean;
  onMount: () => void;
  onUnmount: () => void;
}

export type ExplorerPage = React.FunctionComponent<ExplorerPageProps>;

export const ExplorerPageComponent: ExplorerPage = ({ loading, onMount, onUnmount }) => {
  const classes = useStyles();

  React.useEffect(() => {
    onMount();
    return onUnmount;
  }, []);

  return (
    <ExplorerLayout
      classes={classes}
      loading={loading || false}
      table={<ExplorerTable />}
      toggleBar={<ExplorerToggleBar />}
      searchBar={<ExplorerSearchBar />}
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

const mapStateToProps = (state: IState) => {
  const loading = ExplorerSelectors.selectLoading(state);

  return { loading };
};

export const ExplorerPage = connect(mapStateToProps, mapDispatchToProps)(ExplorerPageComponent);

export default ExplorerPage;

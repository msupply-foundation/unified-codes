import * as React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import { makeStyles, createStyles } from '@unified-codes/ui/styles';

import DetailEntityAttributeList from './DetailEntityAttributeList';
import DetailEntityList from './DetailEntityList';
import DetailPropertyList from './DetailPropertyList';
import DetailLayout from '../../layout/DetailLayout';

import { DetailActions, IDetailAction } from '../../../actions';
import { ITheme } from '../../../styles';
import { IState, IDetailRouteParams } from '../../../types';

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      width: '100%',
    },
    attributeListContainer: {
      backgroundColor: theme.palette.background.footer,
      paddingBottom: 44,
    },
    childListContainer: {
      backgroundColor: theme.palette.background.default,
      margin: '-20px auto 0 auto',
      maxWidth: 900,
      width: '100%',
      borderRadius: 5,
    },
    propertyListContainer: {
      backgroundColor: theme.palette.background.default,
      margin: '0 auto 0 auto',
      maxWidth: 900,
      width: '100%',
      borderRadius: 5,
    },
  })
);

export interface DetailPageProps {
  onMount: (params: IDetailRouteParams) => void;
  onUnmount: (params: IDetailRouteParams) => void;
}

export type DetailPage = React.FunctionComponent<DetailPageProps>;

export const DetailPageComponent: DetailPage = ({
  onMount = () => null,
  onUnmount = () => null,
}) => {
  const classes = useStyles();
  const params: IDetailRouteParams = useParams();

  React.useEffect(() => {
    onMount(params);
    return () => onUnmount(params);
  }, []);

  return (
    <DetailLayout
      classes={classes}
      attributeList={<DetailEntityAttributeList />}
      childList={<DetailEntityList />}
      propertyList={<DetailPropertyList />}
    />
  );
};

const mapDispatchToProps = (dispatch: React.Dispatch<IDetailAction>) => {
  const onMount = (params: IDetailRouteParams) => {
    const { code } = params;
    dispatch(DetailActions.fetchEntity(code));
  };
  const onUnmount = () => null;
  return { onMount, onUnmount };
};

const mapStateToProps = (_: IState) => ({});

export const DetailPage = connect(mapStateToProps, mapDispatchToProps)(DetailPageComponent);

export default DetailPage;

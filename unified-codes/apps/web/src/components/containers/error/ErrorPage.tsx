
import * as React from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles, createStyles } from '@unified-codes/ui/styles';

import ErrorNotFoundTop from './ErrorNotFoundTop';
import ErrorNotFoundCenter from './ErrorNotFoundCenter';
import ErrorNotFoundBottom from './ErrorNotFoundBottom';

import ErrorLayout from '../../layout/ErrorLayout';

import { Errors, IErrorRouteParams } from '../../../types';
import { ITheme } from '../../../styles';

const ERROR_CODES = {
  [Errors.PageNotFound]: '404',
}

const useStyles = makeStyles((_: ITheme) => createStyles({
  root: {
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'center',
      padding: '20px 0 20px 0',
  },
  centerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      padding: '20px 0 20px 0',
  },
  topContainer: {
      textAlign: 'center',
      padding: '20px 0 20px 0',
  },
  bottomContainer: {
    textAlign: 'center',
    padding: '20px 0 20px 0',
  }
}));


export interface ErrorPageProps {
  onMount?: (params: IErrorRouteParams) => void;
  onUnmount?: (params: IErrorRouteParams) => void;
}

export type ErrorPage = React.FunctionComponent<ErrorPageProps>;

export const ErrorPage: ErrorPage = ({ onMount = () => null, onUnmount = () => null }) => {
  const classes = useStyles();
  const params: IErrorRouteParams = useParams();

  React.useEffect(() => {
      onMount(params);
      return () => onUnmount(params);
  }, []);

  const { code = ERROR_CODES[Errors.PageNotFound] } = params;

  switch(code) {
    case ERROR_CODES[Errors.PageNotFound]: return <ErrorLayout classes={classes} top={<ErrorNotFoundTop/>} center={<ErrorNotFoundCenter/>} bottom={<ErrorNotFoundBottom/>} />
    default: return <ErrorLayout classes={classes} top={<ErrorNotFoundTop/>} center={<ErrorNotFoundCenter/>} bottom={<ErrorNotFoundBottom/>} />
  }
}

export default ErrorPage;

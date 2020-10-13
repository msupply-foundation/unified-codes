import * as React from 'react';
import { useParams } from 'react-router-dom';

import ErrorNotFound from './ErrorNotFound';

import { ERROR_ROUTE_PARAMETERS } from '../../../routes';

export interface ErrorPageProps {
  onMount?: (params: ERROR_ROUTE_PARAMETERS) => void;
  onUnmount?: (params: ERROR_ROUTE_PARAMETERS) => void;
}

export type ErrorPage = React.FunctionComponent<ErrorPageProps>;

export const ErrorPage: ErrorPage = ({ onMount = () => null, onUnmount = () => null }) => {
  const params: ERROR_ROUTE_PARAMETERS = useParams();

  React.useEffect(() => {
    onMount(params);
    return () => onUnmount(params);
  }, []);

  switch (params?.code) {
    case '404':
      return <ErrorNotFound />;
    default:
      return <ErrorNotFound />;
  }
};

export default ErrorPage;

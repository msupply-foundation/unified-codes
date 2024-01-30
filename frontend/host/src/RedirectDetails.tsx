import { RouteBuilder } from '@common/utils';
import { AppRoute } from 'frontend/config/src';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

export const RedirectDetails = () => {
  const { code } = useParams();

  return (
    <Navigate
      to={RouteBuilder.create(AppRoute.Browse)
        .addPart(code || '')
        .build()}
      replace={true}
    />
  );
};

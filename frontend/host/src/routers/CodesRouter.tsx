import React, { FC } from 'react';
import { RouteBuilder, Navigate, useMatch } from '@uc-frontend/common';
import { AppRoute } from '@uc-frontend/config';

const CodesService = React.lazy(
  () => import('@uc-frontend/system/src/Codes/Service')
);

const fullPath = RouteBuilder.create(AppRoute.Home).addWildCard().build();

export const CodesRouter: FC = () => {
  const isCodesPath = useMatch(fullPath);

  if (isCodesPath) {
    return <CodesService />;
  }

  const notFoundRoute = RouteBuilder.create(AppRoute.PageNotFound).build();
  return <Navigate to={notFoundRoute} />;
};

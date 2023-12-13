import React, { FC } from 'react';
import { RouteBuilder, Navigate, useMatch } from '@uc-frontend/common';
import { AppRoute } from '@uc-frontend/config';

const EntitiesService = React.lazy(
  () => import('@uc-frontend/system/src/Entities/Service')
);

const fullPath = RouteBuilder.create(AppRoute.Browse).addWildCard().build();

export const EntitiesRouter: FC = () => {
  const isBrowsePath = useMatch(fullPath);

  if (isBrowsePath) {
    return <EntitiesService />;
  }

  const notFoundRoute = RouteBuilder.create(AppRoute.PageNotFound).build();
  return <Navigate to={notFoundRoute} />;
};

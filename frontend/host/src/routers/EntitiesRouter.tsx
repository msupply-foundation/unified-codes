import React, { FC } from 'react';
import { RouteBuilder, Navigate, useMatch } from '@uc-frontend/common';
import { AppRoute } from '@uc-frontend/config';

const EntitiesService = React.lazy(
  () => import('@uc-frontend/system/src/Entities/Service')
);

const fullPath = RouteBuilder.create(AppRoute.Home).addWildCard().build();

export const EntitiesRouter: FC = () => {
  // TODO: not sure if we're going to end up wanting this on a /entities path or something?
  const isEntitiesPath = useMatch(fullPath);

  if (isEntitiesPath) {
    return <EntitiesService />;
  }

  const notFoundRoute = RouteBuilder.create(AppRoute.PageNotFound).build();
  return <Navigate to={notFoundRoute} />;
};

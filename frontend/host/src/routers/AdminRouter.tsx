import React, { FC } from 'react';
import { RouteBuilder, Navigate, useMatch } from '@uc-frontend/common';
import { AppRoute } from '@uc-frontend/config';

const AdminService = React.lazy(
  () => import('@uc-frontend/system/src/Admin/Service')
);

const fullPath = RouteBuilder.create(AppRoute.Admin).addWildCard().build();

export const AdminRouter: FC = () => {
  // TODO: not sure if we're going to end up wanting this on a /entities path or something?
  const isAdminPath = useMatch(fullPath);

  if (isAdminPath) {
    return <AdminService />;
  }

  const notFoundRoute = RouteBuilder.create(AppRoute.PageNotFound).build();
  return <Navigate to={notFoundRoute} />;
};

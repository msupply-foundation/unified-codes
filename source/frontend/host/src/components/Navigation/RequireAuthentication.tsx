import React, { FC, useEffect } from 'react';
import { useAuthContext, useLocation, useNavigate } from '@uc-frontend/common';
import { AppRoute } from '@uc-frontend/config';
import { PropsWithChildrenOnly } from '@common/types';

export const RequireAuthentication: FC<PropsWithChildrenOnly> = ({
  children,
}) => {
  const { token } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate(`/${AppRoute.Login}`, {
        replace: true,
        state: { from: location },
      });
    }
  }, []);

  return <>{children}</>;
};

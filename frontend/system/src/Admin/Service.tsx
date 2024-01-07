import React from 'react';
import { Routes, Route, Navigate } from '@uc-frontend/common';
import { DrugEditForm } from './DrugEditForm';
import { AppRoute } from 'frontend/config/src';
import { UserAccountListView } from './Users/ListView';
import { ConfigurationTabsView } from './Configuration';

const AdminService = () => (
  <Routes>
    <Route path={`/${AppRoute.NewDrug}`} element={<DrugEditForm />} />
    <Route
      path={`/${AppRoute.UserAccounts}`}
      element={<UserAccountListView />}
    />
    <Route
      path={`/${AppRoute.Configuration}`}
      element={<ConfigurationTabsView />}
    />
    <Route
      path="*"
      element={<Navigate to={`/${AppRoute.Browse}`} replace={true} />}
    />
  </Routes>
);

export default AdminService;

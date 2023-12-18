import React from 'react';
import { Routes, Route } from '@uc-frontend/common';
import { DrugEditForm } from './DrugEditForm';
import { AppRoute } from 'frontend/config/src';
import { UserAccountListView } from './Users/ListView';
import { ConfigurationTabsView } from './Configuration';

const AdminService = () => {
  return (
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
    </Routes>
  );
};

export default AdminService;

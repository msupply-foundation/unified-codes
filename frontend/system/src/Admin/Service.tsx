import React from 'react';
import { Routes, Route, Navigate } from '@uc-frontend/common';
import { AppRoute } from 'frontend/config/src';
import { DrugEditForm, EditDrugView } from './EditDrug';
import { UserAccountListView } from './Users/ListView';
import { ConfigurationTabsView } from './Configuration';
import { PendingChangesListView } from './PendingChanges';

const AdminService = () => {
  return (
    <Routes>
      <Route path={`/${AppRoute.NewDrug}`} element={<DrugEditForm />} />
      <Route path={`/${AppRoute.Edit}/:code`} element={<EditDrugView />} />
      <Route
        path={`/${AppRoute.UserAccounts}`}
        element={<UserAccountListView />}
      />
      <Route
        path={`/${AppRoute.Configuration}`}
        element={<ConfigurationTabsView />}
      />
      <Route
        path={`/${AppRoute.PendingChanges}`}
        element={<PendingChangesListView />}
      />
      <Route
        path="*"
        element={<Navigate to={`/${AppRoute.Browse}`} replace={true} />}
      />
    </Routes>
  );
};

export default AdminService;

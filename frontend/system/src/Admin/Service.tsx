import React from 'react';
import { EditDrugView, NewItemView } from './EditEntity';
import { Routes, Route, Navigate } from '@uc-frontend/common';
import { AppRoute } from 'frontend/config/src';
import { UserAccountListView } from './Users/ListView';
import { ConfigurationTabsView } from './Configuration';
import { PendingChangeDetails, PendingChangesListView } from './PendingChanges';

const AdminService = () => {
  return (
    <Routes>
      <Route path={`/${AppRoute.NewItem}`} element={<NewItemView />} />
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
        path={`/${AppRoute.PendingChanges}/:id`}
        element={<PendingChangeDetails />}
      />
      <Route
        path="*"
        element={<Navigate to={`/${AppRoute.Browse}`} replace={true} />}
      />
    </Routes>
  );
};

export default AdminService;

import React from 'react';
import { Routes, Route } from '@uc-frontend/common';
import { DrugEditForm } from './DrugEditForm';
import { AppRoute } from 'frontend/config/src';
import { UserAccountListView } from './Users/ListView';

const AdminService = () => {
  return (
    <Routes>
      <Route path={`/${AppRoute.NewDrug}`} element={<DrugEditForm />} />
      <Route
        path={`/${AppRoute.UserAccounts}`}
        element={<UserAccountListView />}
      />
    </Routes>
  );
};

export default AdminService;

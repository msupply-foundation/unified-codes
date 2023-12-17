import React from 'react';
import { Routes, Route } from '@uc-frontend/common';
import { DrugEditForm } from './DrugEditForm';
import { AppRoute } from 'frontend/config/src';

const AdminService = () => {
  return (
    <Routes>
      <Route path={`/${AppRoute.NewDrug}`} element={<DrugEditForm />} />
    </Routes>
  );
};

export default AdminService;

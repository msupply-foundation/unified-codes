import React from 'react';
import { Routes, Route } from '@uc-frontend/common';
import DrugEditForm from './DrugEditForm';

const AdminService = () => {
  return (
    <Routes>
      <Route path="/new-drug" element={<DrugEditForm />} />
    </Routes>
  );
};

export default AdminService;

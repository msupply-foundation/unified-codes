import React from 'react';
import { Routes, Route } from '@uc-frontend/common';

const AdminService = () => {
  return (
    <Routes>
      <Route path="/" element={<>ADMIN</>} />
    </Routes>
  );
};

export default AdminService;

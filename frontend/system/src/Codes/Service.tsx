import React from 'react';
import { Routes, Route } from '@uc-frontend/common';
import { ListView } from './ListView';

const CodesService = () => {
  return (
    <Routes>
      <Route path="/" element={<ListView />} />
    </Routes>
  );
};

export default CodesService;

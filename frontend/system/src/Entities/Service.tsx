import React from 'react';
import { Routes, Route } from '@uc-frontend/common';
import { ListView } from './ListView';
import { EntityDetails } from './EntityDetails';

const EntitiesService = () => {
  return (
    <Routes>
      <Route path="/" element={<ListView />} />
      <Route path="/details/:code" element={<EntityDetails />} />
    </Routes>
  );
};

export default EntitiesService;

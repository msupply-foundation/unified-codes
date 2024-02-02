import React from 'react';
import { Routes, Route } from '@uc-frontend/common';
import { ListView } from './ListView';
import { EntityDetails } from './EntityDetails';
import { BarcodeListView, BarcodeListForEntityView } from './Barcodes';
import { AppRoute } from 'frontend/config/src';

const EntitiesService = () => {
  return (
    <Routes>
      <Route path="/" element={<ListView />} />
      <Route path={`/${AppRoute.Barcodes}`} element={<BarcodeListView />} />
      <Route
        path={`/${AppRoute.Barcodes}/:code`}
        element={<BarcodeListForEntityView />}
      />
      <Route path="/:code" element={<EntityDetails />} />
    </Routes>
  );
};

export default EntitiesService;

import React from 'react';
import { Routes, Route, Box, Paper } from '@uc-frontend/common';
import { ListView } from './ListView';
import { EntityDetails } from './EntityDetails';

const EntitiesService = () => {
  return (
    <Paper
      sx={{
        backgroundColor: 'background.menu',
        borderRadius: '16px',
        flex: 1,
        margin: '10px auto',
        maxWidth: '1200px',
        padding: '16px',
        width: '100%',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          display: 'flex',
          borderRadius: '16px',
          padding: '16px',
          maxHeight: '100%',
        }}
      >
        <Routes>
          <Route path="/" element={<ListView />} />
          <Route path="/:code" element={<EntityDetails />} />
        </Routes>
      </Box>
    </Paper>
  );
};

export default EntitiesService;

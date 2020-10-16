import * as React from 'react';

import './ExplorerProgressCat.css';

import { Box } from '@unified-codes/ui/components';

export const ExplorerProgressCat = () => (
  <Box className="loading-cat">
    <Box className="cat-body"></Box>
    <Box className="cat-animation-mask"></Box>
    <Box className="cat-head">
      <Box className="cat-face"></Box>
      <Box className="cat-ear"></Box>
      <Box className="cat-hand"></Box>
      <Box className="cat-eye"></Box>
      <Box className="cat-eye-light"></Box>
      <Box className="cat-mouth"></Box>
      <Box className="cat-beard left"></Box>
      <Box className="cat-beard right"></Box>
    </Box>
    <Box className="cat-foot">
      <Box className="cat-belly"></Box>
      <Box className="cat-leg"></Box>
      <Box className="cat-tail"></Box>
    </Box>
  </Box>
);

export default ExplorerProgressCat;

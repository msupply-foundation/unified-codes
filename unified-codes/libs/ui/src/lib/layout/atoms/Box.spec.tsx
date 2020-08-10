import React from 'react';
import { render } from '@testing-library/react';

import Box from './Box';

describe(' Box', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Box />);
    expect(baseElement).toBeTruthy();
  });
});

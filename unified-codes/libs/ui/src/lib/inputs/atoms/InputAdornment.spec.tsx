import React from 'react';
import { render } from '@testing-library/react';

import InputAdornment from './InputAdornment';

describe(' InputAdornment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InputAdornment />);
    expect(baseElement).toBeTruthy();
  });
});

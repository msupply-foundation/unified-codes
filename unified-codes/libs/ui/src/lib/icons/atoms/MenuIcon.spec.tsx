import React from 'react';
import { render } from '@testing-library/react';

import MenuIcon from './MenuIcon';

describe(' MenuIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MenuIcon />);
    expect(baseElement).toBeTruthy();
  });
});

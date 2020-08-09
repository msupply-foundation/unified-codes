import React from 'react';
import { render } from '@testing-library/react';

import AppBar from './AppBar';

describe(' AppBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AppBar />);
    expect(baseElement).toBeTruthy();
  });
});

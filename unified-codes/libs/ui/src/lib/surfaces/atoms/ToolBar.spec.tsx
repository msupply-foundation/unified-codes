import React from 'react';
import { render } from '@testing-library/react';

import Toolbar from './Toolbar';

describe(' Toolbar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Toolbar />);
    expect(baseElement).toBeTruthy();
  });
});

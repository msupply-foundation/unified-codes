import React from 'react';
import { render } from '@testing-library/react';

import Snackbar from './Snackbar';

describe(' Snackbar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Snackbar />);
    expect(baseElement).toBeTruthy();
  });
});

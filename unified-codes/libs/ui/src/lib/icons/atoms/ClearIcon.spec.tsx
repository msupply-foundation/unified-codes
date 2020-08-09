import React from 'react';
import { render } from '@testing-library/react';

import ClearIcon from './ClearIcon';

describe(' ClearIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClearIcon />);
    expect(baseElement).toBeTruthy();
  });
});

import React from 'react';
import { render } from '@testing-library/react';

import ClearButton from './ClearButton';

describe(' ClearButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClearButton />);
    expect(baseElement).toBeTruthy();
  });
});

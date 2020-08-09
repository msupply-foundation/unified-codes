import React from 'react';
import { render } from '@testing-library/react';

import ClearInput from './ClearInput';

describe(' ClearInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClearInput />);
    expect(baseElement).toBeTruthy();
  });
});

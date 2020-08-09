import React from 'react';
import { render } from '@testing-library/react';

import PersonIcon from './PersonIcon';

describe(' PersonIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PersonIcon />);
    expect(baseElement).toBeTruthy();
  });
});

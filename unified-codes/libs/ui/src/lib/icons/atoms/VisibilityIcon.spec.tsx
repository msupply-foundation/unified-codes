import React from 'react';
import { render } from '@testing-library/react';

import VisibilityIcon from './VisibilityIcon';

describe(' VisibilityIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VisibilityIcon />);
    expect(baseElement).toBeTruthy();
  });
});

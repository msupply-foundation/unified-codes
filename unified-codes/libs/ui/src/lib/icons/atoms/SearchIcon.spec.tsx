import React from 'react';
import { render } from '@testing-library/react';

import SearchIcon from './SearchIcon';

describe(' SearchIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SearchIcon />);
    expect(baseElement).toBeTruthy();
  });
});

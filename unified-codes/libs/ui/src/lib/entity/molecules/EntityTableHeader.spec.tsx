import React from 'react';
import { render } from '@testing-library/react';

import EntityTableHeader from './EntityTableHeader';

describe(' EntityTableHeader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EntityTableHeader />);
    expect(baseElement).toBeTruthy();
  });
});

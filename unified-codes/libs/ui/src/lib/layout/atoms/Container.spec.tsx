import React from 'react';
import { render } from '@testing-library/react';

import Container from './Container';

describe(' Container', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Container />);
    expect(baseElement).toBeTruthy();
  });
});

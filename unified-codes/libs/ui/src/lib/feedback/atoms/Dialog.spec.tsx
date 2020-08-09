import React from 'react';
import { render } from '@testing-library/react';

import Dialog from './Dialog';

describe(' Dialog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Dialog open={true}/>);
    expect(baseElement).toBeTruthy();
  });
});

import React from 'react';
import { render } from '@testing-library/react';

import DialogContent from './DialogContent';

describe(' DialogContent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DialogContent />);
    expect(baseElement).toBeTruthy();
  });
});

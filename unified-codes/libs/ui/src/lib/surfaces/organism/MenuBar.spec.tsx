import React from 'react';
import { render } from '@testing-library/react';

import MenuBar from './MenuBar';

describe(' MenuBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MenuBar open={true}/>);
    expect(baseElement).toBeTruthy();
  });
});

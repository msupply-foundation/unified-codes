import React from 'react';
import { render } from '@testing-library/react';

import VpnKeyIcon from './VpnKeyIcon';

describe(' VpnKeyIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VpnKeyIcon />);
    expect(baseElement).toBeTruthy();
  });
});

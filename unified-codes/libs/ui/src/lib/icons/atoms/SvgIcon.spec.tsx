import React from 'react';
import { render } from '@testing-library/react';

import SvgIcon from './SvgIcon';

describe(' SvgIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SvgIcon />);
    expect(baseElement).toBeTruthy();
  });
});

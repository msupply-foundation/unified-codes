import React from 'react';
import { render } from '@testing-library/react';

import Menu from './Menu';
import MenuItem from './MenuItem';

describe(' MenuItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Menu open={true}><MenuItem /></Menu>);
    expect(baseElement).toBeTruthy();
  });
});

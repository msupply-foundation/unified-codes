import React from 'react';
import { render } from '@testing-library/react';

import LoginInput from './LoginInput';

describe(' LoginInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LoginInput/>);
    expect(baseElement).toBeTruthy();
  });
});
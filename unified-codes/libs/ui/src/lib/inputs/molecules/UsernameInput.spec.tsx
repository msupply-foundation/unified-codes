import React from 'react';
import { render } from '@testing-library/react';

import UsernameInput from './PasswordInput';

describe(' UsernameInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UsernameInput/>);
    expect(baseElement).toBeTruthy();
  });
});
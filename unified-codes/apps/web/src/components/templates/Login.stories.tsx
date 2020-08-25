import * as React from 'react';

import { LoginComponent } from './Login';

export default { title: 'Login' };

export const primary = () => {
  const onLogin = () => console.log('Called callback: onLogin');

  return <LoginComponent onLogin={onLogin} />;
};

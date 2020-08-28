import React from 'react';
import { Container } from './Container';

export default {
  component: Container,
  title: 'Container',
};

export const withNoProps = () => {
  return <Container>Hello Container!</Container>;
};

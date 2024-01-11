import React from 'react';
import { useParams } from 'react-router';

export const PendingChangeDetails = () => {
  const { id } = useParams();
  return <>{id}</>;
};

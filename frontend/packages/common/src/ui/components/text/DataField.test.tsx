import { render, screen } from '@testing-library/react';
import React from 'react';
import { DataField } from './DataField';
import { TestingProvider } from '@common/utils';

describe('DataField', () => {
  it('displays value when provided', () => {
    render(
      <TestingProvider>
        <DataField label="label" value="value" />
      </TestingProvider>
    );

    expect(screen.getByText(/label/)).toBeInTheDocument();
    expect(screen.getByText('value')).toBeInTheDocument();
  });

  it('displays "Not Provided" when value is empty string', () => {
    render(
      <TestingProvider>
        <DataField label="label" value="" />
      </TestingProvider>
    );

    expect(screen.getByText('Not provided')).toBeInTheDocument();
  });
  it('displays "Not Provided" when value is null', () => {
    render(
      <TestingProvider>
        <DataField label="label" value={null} />
      </TestingProvider>
    );

    expect(screen.getByText('Not provided')).toBeInTheDocument();
  });
  it('displays "Not Provided" when value is undefined', () => {
    render(
      <TestingProvider>
        <DataField label="label" value={undefined} />
      </TestingProvider>
    );

    expect(screen.getByText('Not provided')).toBeInTheDocument();
  });
});

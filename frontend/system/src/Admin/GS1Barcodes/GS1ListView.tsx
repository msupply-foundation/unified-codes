import { useQueryParamsState } from '@common/hooks';
import React from 'react';
import { useGS1Barcodes } from './api';
import { GS1List } from './GS1List';

export const GS1ListView = () => {
  const { queryParams, updatePaginationQuery } = useQueryParamsState();

  const { data, isError, isLoading } = useGS1Barcodes(queryParams);

  const gs1Barcodes = data?.data ?? [];

  const { page, first, offset } = queryParams;
  const pagination = {
    page,
    offset,
    first,
    total: data?.totalCount,
  };

  return (
    <GS1List
      gs1Barcodes={gs1Barcodes}
      pagination={pagination}
      isError={isError}
      isLoading={isLoading}
      updatePaginationQuery={updatePaginationQuery}
    />
  );
};

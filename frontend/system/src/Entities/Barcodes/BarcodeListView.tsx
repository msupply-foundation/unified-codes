import { useQueryParamsState } from '@common/hooks';
import React from 'react';
import { useBarcodes } from './api';
import { BarcodeList } from './BarcodeList';

export const BarcodeListView = () => {
  const { queryParams, updatePaginationQuery } = useQueryParamsState();

  const { data, isError, isLoading } = useBarcodes(queryParams);

  const barcodes = data?.data ?? [];

  const { page, first, offset } = queryParams;
  const pagination = {
    page,
    offset,
    first,
    total: data?.totalCount,
  };

  return (
    <BarcodeList
      barcodes={barcodes}
      pagination={pagination}
      isError={isError}
      isLoading={isLoading}
      updatePaginationQuery={updatePaginationQuery}
    />
  );
};

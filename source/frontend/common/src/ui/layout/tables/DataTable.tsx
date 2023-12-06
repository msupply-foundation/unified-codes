/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';

import {
  Box,
  TableBody,
  TableHead,
  TableContainer,
  Table as MuiTable,
  Typography,
} from '@mui/material';
import { BasicSpinner, useRegisterActions } from '@uc-frontend/common';

import { TableProps } from './types';
import { DataRow } from './components/DataRow/DataRow';
import { PaginationRow } from './columns/PaginationRow';
import { HeaderCell, HeaderRow } from './components/Header';
import { RecordWithId } from 'frontend/common/src/types';
import { useTranslation } from 'frontend/common/src/intl';
import { useTableStore } from './context';

export const DataTableComponent = <T extends RecordWithId>({
  ExpandContent,
  columns,
  data = [],
  dense = false,
  isDisabled = false,
  isError = false,
  isLoading = false,
  noDataElement,
  noDataMessage,
  pagination,
  onChangePage,
  onRowClick,
}: TableProps<T>): JSX.Element => {
  const t = useTranslation();
  const { setRows, setDisabledRows, setFocus } = useTableStore();
  const [clickFocusedRow, setClickFocusedRow] = useState(false);
  useRegisterActions([
    {
      id: 'table:focus-down',
      name: '', // No name => won't show in Modal menu
      shortcut: ['arrowdown'],
      keywords: 'focus, down',
      perform: () => setFocus('down'),
    },
    {
      id: 'table:focus-up',
      name: '',
      shortcut: ['arrowup'],
      keywords: 'focus, up',
      perform: () => setFocus('up'),
    },
    {
      id: 'table:press-enter',
      name: '',
      shortcut: ['enter'],
      keywords: 'table, enter',
      perform: () => setClickFocusedRow(true),
    },
  ]);

  useEffect(() => {
    if (data.length) setRows(data.map(({ id }) => id));
  }, [data]);

  useEffect(() => {
    if (isDisabled) setDisabledRows(data.map(({ id }) => id));
  }, [isDisabled, data]);

  // guard against a page number being set which is greater than the data allows
  useEffect(() => {
    if (!pagination || !onChangePage || !pagination.total) return;
    const { page, first, total } = pagination;
    if (page * first > total) onChangePage(0);
  }, [pagination]);

  if (isLoading) return <BasicSpinner />;

  if (isError) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography sx={{ color: 'error.main' }}>
          {t('error.unable-to-load-data')}
        </Typography>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      noDataElement || (
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6">
            {noDataMessage || t('error.no-results')}
          </Typography>
        </Box>
      )
    );
  }

  return (
    <TableContainer
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}
    >
      <MuiTable>
        <TableHead
          sx={{
            backgroundColor: 'background.white',
            position: 'sticky',
            top: 0,
            zIndex: 'tableHeader',
            boxShadow: dense ? null : theme => theme.shadows[2],
          }}
        >
          <HeaderRow dense={dense}>
            {columns.map(column => (
              <HeaderCell
                dense={dense}
                column={column}
                key={String(column.key)}
              />
            ))}
          </HeaderRow>
        </TableHead>
        <TableBody>
          {data?.map((row, idx) => (
            <DataRow
              key={row.id}
              rows={data}
              ExpandContent={ExpandContent}
              rowIndex={idx}
              columns={columns}
              onClick={onRowClick ? onRowClick : undefined}
              rowData={row}
              rowKey={String(idx)}
              dense={dense}
              keyboardActivated={clickFocusedRow}
            />
          ))}
        </TableBody>
      </MuiTable>
      <Box
        sx={{
          flex: 0,
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          left: 0,
          insetBlockEnd: 0,
          backgroundColor: 'white',
          justifyContent: 'flex-end',
          zIndex: 100,
        }}
      >
        {pagination && onChangePage && (
          <PaginationRow
            page={pagination.page}
            offset={pagination.offset}
            first={pagination.first}
            total={pagination.total ?? 0}
            onChange={onChangePage}
          />
        )}
      </Box>
    </TableContainer>
  );
};

// This is a hack!
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087
// Using generic types while using `react.memo` doesn't work well.
// There are a few alternatives for some situations. However they didn't
// work for this one!
export const DataTable = React.memo(
  DataTableComponent
) as typeof DataTableComponent;

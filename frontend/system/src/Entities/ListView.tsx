import React, { useEffect, useState } from 'react';
import { useTranslation } from '@common/intl';
import {
  AppBarContentPortal,
  DataTable,
  NothingHere,
  TableProvider,
  createTableStore,
  useColumns,
  SearchToolbar,
  ToggleButton,
} from '@common/ui';
import { useBreadcrumbs, useQueryParamsState } from '@common/hooks';
import { useEntities } from '../api';
import { Box, Paper, ToggleButtonGroup } from '@mui/material';

export const ListView = () => {
  const t = useTranslation('system');
  const { setSuffix } = useBreadcrumbs();

  useEffect(() => {
    setSuffix('Browse');
  }, []);

  const { filter, queryParams, updatePaginationQuery, updateSortQuery } =
    useQueryParamsState({
      initialSort: { key: 'description', dir: 'asc' },
    });

  const { sortBy, page, offset, first } = queryParams;

  const columns = useColumns(
    [
      { key: 'code', label: 'label.code', width: 200, sortable: false },
      { key: 'description', label: 'label.description' },
      { key: 'type', label: 'label.type', sortable: false, width: 200 },
    ],
    { sortBy: sortBy, onChangeSortBy: updateSortQuery },
    [sortBy, updateSortQuery]
  );

  const [categories, setCategories] = useState<string[]>(['drug']);

  const searchFilter = filter.filterBy?.['search'];
  const search = typeof searchFilter === 'string' ? searchFilter : '';

  const { data, isError, isLoading } = useEntities({
    filter: {
      categories,
      description: search,
      orderBy: {
        field: sortBy.key,
        descending: sortBy.isDesc,
      },
      match: 'contains',
    },
    first,
    offset,
  });

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter(c => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  const entities = data?.data ?? [];

  const pagination = {
    page,
    offset,
    first,
    total: data?.totalLength,
  };

  return (
    <Paper
      sx={{
        borderRadius: '16px',
        margin: '10px auto',
        padding: '16px',
        width: '100%',
        maxWidth: '1200px',
        backgroundColor: 'background.menu',
        flex: 1,
      }}
    >
      <TableProvider createStore={createTableStore}>
        <AppBarContentPortal
          sx={{
            paddingBottom: '16px',
            flex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            maxWidth: '1200px',
            marginRight: 'max(0px, calc((100vw - 1232px) / 2))',
          }}
        >
          <SearchToolbar filter={filter} />
          <ToggleButtonGroup>
            <ToggleButton
              label={t('label.drugs')}
              value={'drug'}
              selected={categories.includes('drug')}
              onClick={() => {
                toggleCategory('drug');
              }}
            />
            <ToggleButton
              label={t('label.consumables')}
              value={'consumable'}
              selected={categories.includes('consumable')}
              onClick={() => {
                toggleCategory('consumable');
              }}
            />
          </ToggleButtonGroup>
        </AppBarContentPortal>

        <Box
          sx={{ backgroundColor: 'white', maxHeight: '100%', display: 'flex' }}
        >
          <DataTable
            columns={columns}
            data={entities}
            isError={isError}
            isLoading={isLoading}
            noDataElement={<NothingHere body={t('error.no-data')} />}
            pagination={pagination}
            onChangePage={updatePaginationQuery}
          />
        </Box>
      </TableProvider>
    </Paper>
  );
};

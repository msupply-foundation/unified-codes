import React, { useState } from 'react';
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
import { useQueryParamsState } from '@common/hooks';
import { EntityRowFragment, useEntities } from '../api';
import { ToggleButtonGroup } from '@mui/material';
import { useNavigate } from 'react-router';
import { RouteBuilder } from '@common/utils';
import { AppRoute } from 'frontend/config/src';

export const ListView = () => {
  const t = useTranslation('system');
  const navigate = useNavigate();

  const { filter, queryParams, updatePaginationQuery, updateSortQuery } =
    useQueryParamsState({
      initialSort: { key: 'description', dir: 'asc' },
    });

  const { sortBy, page, offset, first } = queryParams;

  const columns = useColumns<EntityRowFragment>(
    [
      { key: 'code', label: 'label.code', width: 200, sortable: false },
      { key: 'description', label: 'label.description', width: 1000 },
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
    },
    first,
    offset,
  });

  const updateCategories = (category: string) => {
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
    <>
      <TableProvider createStore={createTableStore}>
        <AppBarContentPortal
          sx={{
            paddingBottom: '16px',
            flex: 1,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <SearchToolbar filter={filter} />
          <ToggleButtonGroup>
            <ToggleButton
              label={t('label.drugs')}
              value={'drug'}
              selected={categories.includes('drug')}
              onClick={() => {
                updateCategories('drug');
              }}
            />
            <ToggleButton
              label={t('label.consumables')}
              value={'consumable'}
              selected={categories.includes('consumable')}
              onClick={() => {
                updateCategories('consumable');
              }}
            />
          </ToggleButtonGroup>
        </AppBarContentPortal>

        <DataTable
          columns={columns}
          data={entities}
          isError={isError}
          isLoading={isLoading}
          noDataElement={<NothingHere body={t('error.no-data')} />}
          pagination={pagination}
          onChangePage={updatePaginationQuery}
          onRowClick={e =>
            navigate(
              RouteBuilder.create(AppRoute.Browse).addPart(e.code).build()
            )
          }
        />
      </TableProvider>
    </>
  );
};

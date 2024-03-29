import React from 'react';
import { useTranslation } from '@common/intl';
import {
  AppBarContentPortal,
  DataTable,
  NothingHere,
  TableProvider,
  createTableStore,
  useColumns,
  ToggleButton,
  Stack,
} from '@common/ui';
import { useQueryParamsState, useUrlQuery } from '@common/hooks';
import { EntityRowFragment, useEntities } from './api';
import { ToggleButtonGroup } from '@mui/material';
import { useNavigate } from 'react-router';
import { RouteBuilder } from '@common/utils';
import { AppRoute } from 'frontend/config/src';
import { EntitySearchBar } from './EntitySearchBar';

export const ListView = () => {
  const t = useTranslation('system');
  const navigate = useNavigate();

  const { filter, queryParams, updatePaginationQuery, updateSortQuery } =
    useQueryParamsState({
      initialSort: { key: 'description', dir: 'asc' },
    });

  const { urlQuery, updateQuery } = useUrlQuery();

  const { sortBy, page, offset, first } = queryParams;

  const columns = useColumns<EntityRowFragment>(
    [
      { key: 'code', label: 'label.code', width: 200, sortable: false },
      { key: 'description', label: 'label.description' },
      { key: 'type', label: 'label.type', sortable: false, width: 200 },
    ],
    { sortBy: sortBy, onChangeSortBy: updateSortQuery },
    [sortBy, updateSortQuery]
  );

  const categories: string[] = urlQuery.categories ?? [];

  const searchFilter = filter.filterBy?.['search'];
  const search = typeof searchFilter === 'string' ? searchFilter : '';

  const { data, isError, isLoading } = useEntities({
    filter: {
      categories: categories.length
        ? categories
        : ['drug', 'consumable', 'vaccine'],
      type: 'drug',
      search,
      orderBy: {
        field: sortBy.key,
        descending: sortBy.isDesc,
      },
    },
    first,
    offset,
  });

  const { data: allProducts, isLoading: allProductsIsLoading } = useEntities({
    filter: {
      categories: ['drug', 'consumable', 'vaccine'],
      orderBy: {
        field: sortBy.key,
        descending: sortBy.isDesc,
      },
    },
    first: 10000,
    offset,
  });

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      updateQuery({ ['categories[]']: categories.filter(c => c !== category) });
    } else {
      updateQuery({ ['categories[]']: [...categories, category] });
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
        <Stack>
          <EntitySearchBar
            products={allProducts?.data ?? []}
            onChange={newValue => {
              filter.onChangeStringRule('search', newValue);
            }}
            placeholder={t('placeholder.search')}
            isLoading={isLoading || allProductsIsLoading}
            debounceTime={500}
          />
        </Stack>

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
          <ToggleButton
            label={t('label.vaccines')}
            value={'vaccine'}
            selected={categories.includes('vaccine')}
            onClick={() => {
              toggleCategory('vaccine');
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
          navigate(RouteBuilder.create(AppRoute.Browse).addPart(e.code).build())
        }
      />
    </TableProvider>
  );
};

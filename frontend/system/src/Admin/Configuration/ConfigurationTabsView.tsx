import { DetailTabs, TabDefinition } from '@common/components';
import { useTranslation } from '@common/intl';
import {
  Box,
  createTableStore,
  DataTable,
  Paper,
  TableProvider,
  useColumns,
} from '@common/ui';
import React from 'react';
import { categories } from '../DrugEditForm/categories';

export const ConfigurationTabsView = () => {
  const t = useTranslation('system');

  const tabs: TabDefinition[] = [
    {
      Component: <ConfigurationList data={categories.routes} />,
      value: t('label.routes'),
    },
    {
      Component: <ConfigurationList data={categories.forms} />,
      value: t('label.forms'),
    },
    {
      Component: <ConfigurationList data={categories.immediatePackagings} />,
      value: t('label.immediate-packaging'),
    },
    // TODO: would be nice to manage properties options here too
    // would need to also manage what the external links to the different databases are
    // and see if we have other references to the property codes throughout the codebase first!
  ];
  return (
    <Paper
      sx={{
        backgroundColor: 'background.menu',
        borderRadius: '16px',
        flex: 1,
        margin: '10px auto',
        maxWidth: '1200px',
        padding: '16px',
        width: '100%',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          display: 'flex',
          borderRadius: '16px',
          padding: '0 16px',
          maxHeight: '100%',
          overflow: 'auto',
        }}
      >
        <DetailTabs tabs={tabs} />
      </Box>
    </Paper>
  );
};

const ConfigurationList = ({
  data,
}: {
  data: { id: string; label: string; value: string }[];
}) => {
  const columns = useColumns([
    {
      key: 'value',
      label: 'label.value',
    },
  ]);

  return (
    <TableProvider createStore={createTableStore}>
      <DataTable columns={columns} data={data} />
    </TableProvider>
  );
};

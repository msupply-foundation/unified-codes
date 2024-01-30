import React from 'react';
import { AppBarButtonsPortal, LoadingButton } from '@common/components';
import { useTranslation } from '@common/intl';
import {
  createTableStore,
  DataTable,
  PlusCircleIcon,
  TableProvider,
  useColumns,
} from '@common/ui';
import { useEditModal } from '@common/hooks';
import { PropertyOptionEditModal } from './PropertyEditModal';
import { usePropertyConfigurationItems } from './api/hooks/usePropertyConfigurationItems';
import { PropertyConfigurationItemFragment } from './api/operations.generated';

export const PropertiesConfigTab = () => {
  const t = useTranslation('system');
  const { onOpen, onClose, isOpen, entity, mode } =
    useEditModal<PropertyConfigurationItemFragment>();

  const { data } = usePropertyConfigurationItems();

  const columns = useColumns<PropertyConfigurationItemFragment>([
    { key: 'type', label: 'label.type' },
    { key: 'label', label: 'label.title' },
    { key: 'url', label: 'label.website' },
  ]);

  return (
    <TableProvider createStore={createTableStore}>
      {isOpen && (
        <PropertyOptionEditModal
          isOpen={isOpen}
          onClose={onClose}
          property={entity}
          mode={mode}
        />
      )}
      <AppBarButtonsPortal>
        <LoadingButton
          onClick={() => onOpen()}
          isLoading={false}
          startIcon={<PlusCircleIcon />}
        >
          {t('label.add-property')}
        </LoadingButton>
      </AppBarButtonsPortal>

      <DataTable columns={columns} data={data} onRowClick={onOpen} />
    </TableProvider>
  );
};

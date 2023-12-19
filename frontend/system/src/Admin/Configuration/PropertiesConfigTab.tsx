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

// TODO: this type should come from gql codegen types
type Property = {
  id: string;
  type: string;
  value: string;
  url: string;
};

type PropertiesConfigTabProps = {
  data: Property[];
};

export const PropertiesConfigTab = ({ data }: PropertiesConfigTabProps) => {
  const t = useTranslation('system');
  const { onOpen, onClose, isOpen, entity, mode } = useEditModal<Property>();

  const columns = useColumns<Property>([
    { key: 'type', label: 'label.type' },
    { key: 'value', label: 'label.value' },
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

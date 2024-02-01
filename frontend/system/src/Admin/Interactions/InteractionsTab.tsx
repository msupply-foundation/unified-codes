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
import { InteractionEditModal } from './InteractionEditModal';
import { useAllDrugInteractions } from './api/hooks/useInteractions';
import { DrugInteractionFragment } from './api/operations.generated';

export const InteractionTab = () => {
  const t = useTranslation('system');
  const { onOpen, onClose, isOpen, entity, mode } =
    useEditModal<DrugInteractionFragment>(); //TODO replace with actual data type

  const columns = useColumns<DrugInteractionFragment>([
    { key: 'name', label: 'label.name' },
    { key: 'severity', label: 'label.severity' },
  ]);

  const { data, isLoading } = useAllDrugInteractions();

  return (
    <TableProvider createStore={createTableStore}>
      {isOpen && (
        <InteractionEditModal
          isOpen={isOpen}
          onClose={onClose}
          interaction={entity}
          mode={mode}
        />
      )}
      <AppBarButtonsPortal>
        <LoadingButton
          onClick={() => onOpen()}
          isLoading={false}
          startIcon={<PlusCircleIcon />}
        >
          {t('label.add-interaction')}
        </LoadingButton>
      </AppBarButtonsPortal>

      <DataTable columns={columns} data={data} onRowClick={onOpen} />
    </TableProvider>
  );
};

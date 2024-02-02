import React from 'react';
import {
  AppBarButtonsPortal,
  AppBarContentPortal,
  DeleteLinesDropdownItem,
  DropdownMenu,
  LoadingButton,
} from '@common/components';
import { useTranslation } from '@common/intl';
import {
  createTableStore,
  DataTable,
  PlusCircleIcon,
  TableProvider,
  useColumns,
  useTableStore,
} from '@common/ui';
import { useEditModal } from '@common/hooks';
import { InteractionEditModal } from './InteractionEditModal';
import { useAllDrugInteractions } from './api/hooks/useInteractions';
import { DrugInteractionFragment } from './api/operations.generated';
import { useDeleteInteraction } from './api/hooks/useDeleteInteraction';

export const InteractionTabComponent = () => {
  const t = useTranslation('system');
  const { onOpen, onClose, isOpen, entity, mode } =
    useEditModal<DrugInteractionFragment>();

  const { mutateAsync: deleteInteraction } = useDeleteInteraction();

  const columns = useColumns<DrugInteractionFragment>([
    { key: 'name', label: 'label.name' },
    { key: 'severity', label: 'label.severity' },
    'selection',
  ]);

  const { data, isLoading, isError } = useAllDrugInteractions();

  const selectedRows = useTableStore(state =>
    Object.keys(state.rowState)
      .filter(id => state.rowState[id]?.isSelected)
      .map(selectedId => data?.find(({ id }) => selectedId === id))
      .filter(Boolean)
  );

  return (
    <>
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
      <AppBarContentPortal marginBottom={'10px'}>
        <DropdownMenu label={t('label.select')}>
          <DeleteLinesDropdownItem
            selectedRows={selectedRows}
            deleteItem={async (item: DrugInteractionFragment) => {
              await deleteInteraction(item.id);
            }}
          />
        </DropdownMenu>
      </AppBarContentPortal>

      <DataTable
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        data={data}
        onRowClick={onOpen}
      />
    </>
  );
};

export const InteractionTab = () => {
  return (
    <TableProvider createStore={createTableStore}>
      <InteractionTabComponent />
    </TableProvider>
  );
};

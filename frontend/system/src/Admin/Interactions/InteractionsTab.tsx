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

// TODO: Use real type from api
enum InteractionSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// TODO: Use real type from api
type Interaction = {
  id: string;
  name: string;
  severity: InteractionSeverity;
  description: string;
  action: string;
  reference: string;
};

export const InteractionTab = () => {
  const t = useTranslation('system');
  const { onOpen, onClose, isOpen, entity, mode } = useEditModal<Interaction>(); //TODO replace with actual data type

  const columns = useColumns<Interaction>([
    { key: 'name', label: 'label.name' },
    { key: 'severity', label: 'label.severity' },
  ]);

  const data = [
    {
      id: '1',
      name: 'Interaction 1',
      severity: InteractionSeverity.LOW,
      description: 'Description 1',
      action: 'Action 1',
      reference: 'Reference 1',
    },
    {
      id: '2',
      name: 'Interaction 2',
      severity: InteractionSeverity.MEDIUM,
      description: 'Description 2',
      action: 'Action 2',
      reference: 'Reference 2',
    },
    {
      id: '3',
      name: 'Interaction 3',
      severity: InteractionSeverity.HIGH,
      description: 'Description 3',
      action: 'Action 3',
      reference: 'Reference 3',
    },
  ];

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

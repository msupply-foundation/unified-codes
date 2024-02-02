import React, { FC } from 'react';

import { DrugSelectionModal } from './DrugSelectionModal';
import { useTranslation } from '@common/intl';
import { useEditModal } from '@common/hooks';
import {
  ButtonWithIcon,
  DataTable,
  EditIcon,
  IconButton,
  TableProvider,
  createTableStore,
  useColumns,
} from '@common/ui';
import { EntityRowFragment } from '../../Entities/api/operations.generated';

type DrugSelectorProps = {
  records: EntityRowFragment[];
  selectedIds: string[];
  setSelection: (input: { drugIds: string[] }) => void;
  isLoading: boolean;
};

export const DrugSelector: FC<DrugSelectorProps> = ({
  records,
  selectedIds,
  setSelection,
  isLoading,
}) => {
  const t = useTranslation('system');

  const { isOpen, onClose, onOpen } = useEditModal();

  const columns = useColumns<EntityRowFragment>([
    {
      key: 'description',
      label: 'label.name',
      width: 150,
      sortable: false,
    },
    {
      key: 'code',
      label: 'label.code',
      width: 150,
      sortable: false,
    },
  ]);

  const selectedRecords = (records ?? []).filter(s =>
    selectedIds.includes(s.id)
  );

  return (
    <>
      <DrugSelectionModal
        drugs={records ?? []}
        initialSelectedIds={selectedIds}
        isOpen={isOpen}
        onClose={onClose}
        setSelection={setSelection}
      />
      <ButtonWithIcon
        Icon={<EditIcon />}
        label={t('label.select-drugs')}
        onClick={onOpen}
      />
      <TableProvider createStore={createTableStore}>
        <DataTable
          columns={columns}
          isLoading={isLoading}
          data={selectedRecords}
          dense
        />
      </TableProvider>
    </>
  );
};

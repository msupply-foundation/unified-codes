import React from 'react';
import { LoadingButton } from '@common/components';
import { useEditModal } from '@common/hooks';
import { useTranslation } from '@common/intl';
import {
  createTableStore,
  DataTable,
  EditIcon,
  TableProvider,
  useColumns,
} from '@common/ui';
import { ConfigurationEditModal } from './ConfigurationEditModal';

export const CategoryConfigTab = ({
  data,
  name,
}: {
  data: { id: string; label: string; value: string }[];
  name: string;
}) => {
  const t = useTranslation('system');
  const { isOpen, onClose, onOpen } = useEditModal();

  const columns = useColumns([
    {
      key: 'value',
      label: 'label.value',
    },
    {
      key: 'edit_button',
      width: '120px',
      Header: () => (
        <LoadingButton
          isLoading={false}
          startIcon={<EditIcon />}
          onClick={() => onOpen()}
        >
          {t('label.edit')}
        </LoadingButton>
      ),
    },
  ]);

  return (
    <TableProvider createStore={createTableStore}>
      {isOpen && (
        <ConfigurationEditModal
          onClose={onClose}
          isOpen={isOpen}
          title={name}
          data={data}
        />
      )}
      <DataTable columns={columns} data={data} />
    </TableProvider>
  );
};

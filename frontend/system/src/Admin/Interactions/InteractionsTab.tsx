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

type InteractionTabProps = {
  data: String[]; //TODO replace with actual data type
};

export const InteractionTab = ({ data }: InteractionTabProps) => {
  const t = useTranslation('system');
  const { onOpen, onClose, isOpen, entity, mode } = useEditModal<String>(); //TODO replace with actual data type

  return <div>InteractionTab - Coming Soon</div>;

  // const columns = useColumns<Property>([{ key: 'name', label: 'label.name' }]);

  // return (
  //   <TableProvider createStore={createTableStore}>
  //     {isOpen && (
  //       <InteractionEditModal
  //         isOpen={isOpen}
  //         onClose={onClose}
  //         property={entity}
  //         mode={mode}
  //       />
  //     )}
  //     <AppBarButtonsPortal>
  //       <LoadingButton
  //         onClick={() => onOpen()}
  //         isLoading={false}
  //         startIcon={<PlusCircleIcon />}
  //       >
  //         {t('label.add-interaction')}
  //       </LoadingButton>
  //     </AppBarButtonsPortal>

  //     <DataTable columns={columns} data={data} onRowClick={onOpen} />
  //   </TableProvider>
  // );
};

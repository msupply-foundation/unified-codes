import React, { useState } from 'react';
import {
  useDialog,
  DialogButton,
  useTranslation,
  LoadingButton,
  ArrowRightIcon,
  BasicTextInput,
  Box,
  useColumns,
  DataTable,
  createTableStore,
  TableProvider,
  Typography,
} from '@uc-frontend/common';
import { useUuid } from '../../../hooks';
import { Property } from '../types';
import { config } from '../../../config';

interface PropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProperties: Property[]) => void;
  title: string;
  data: Property[] | null;
}

export const PropertiesModal = ({
  isOpen,
  title,
  onClose,
  onSave,
  data,
}: PropertiesModalProps) => {
  const t = useTranslation('system');
  const uuid = useUuid();

  const [properties, setProperties] = useState<Property[]>(
    config.properties.map(config => {
      const existing = data?.find(property => property.type === config.type);
      return {
        // just a throwaway id... a dgraph uid will be assigned when the property is stored
        id: existing ? existing.id : uuid(),
        value: existing ? existing.value : '',
        label: config.label,
        type: config.type,
      };
    })
  );

  const onChange = (property: Property) => {
    const propertyIndex = properties.findIndex(p => p.id === property.id);
    if (propertyIndex >= 0) {
      properties[propertyIndex] = property;
    } else {
      properties.push(property);
    }
    setProperties([...properties]);
  };

  const columns = useColumns<Property>([
    {
      key: 'label',
      width: '50%',
      label: 'label.type',
      sortable: false,
    },
    {
      key: 'value',
      label: 'label.code',
      sortable: false,
      Cell: ({ rowData }) => (
        <BasicTextInput
          fullWidth
          value={rowData.value}
          required
          onChange={e => onChange({ ...rowData, value: e.target.value })}
        />
      ),
    },
  ]);

  const { Modal } = useDialog({ isOpen, onClose });

  return (
    <TableProvider createStore={createTableStore}>
      <Modal
        okButton={
          <LoadingButton
            onClick={() => {
              onSave(properties.filter(p => p.value.trim() !== ''));
              onClose();
            }}
            isLoading={false}
            startIcon={<ArrowRightIcon />}
            sx={{ marginLeft: 1 }}
          >
            {t('button.ok')}
          </LoadingButton>
        }
        cancelButton={<DialogButton variant="cancel" onClick={onClose} />}
        title={t('label.add-properties')}
      >
        <Box>
          <Typography sx={{ fontStyle: 'italic' }}>{title}</Typography>
          <DataTable columns={columns} data={properties} />
        </Box>
      </Modal>
    </TableProvider>
  );
};

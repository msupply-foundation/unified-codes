import React, { useEffect, useState } from 'react';
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
import { usePropertyConfigurationItems } from '../../Configuration/api/hooks/usePropertyConfigurationItems';

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

  const { data: config } = usePropertyConfigurationItems();

  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (config) {
      setProperties(
        config.map(configItem => {
          const existing = data?.find(
            property => property.type === configItem.type
          );
          return {
            id: existing ? existing.id : uuid(),
            code: existing ? existing.code : '',
            value: existing ? existing.value : '',
            label: configItem.label,
            type: configItem.type,
          };
        })
      );
    }
  }, [config]);

  const onChange = (property: Property) => {
    setProperties(properties => {
      const propertyIndex = properties.findIndex(p => p.id === property.id);
      if (propertyIndex >= 0) {
        properties[propertyIndex] = property;
        return [...properties];
      }
      return properties;
    });
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
          disabled={!!rowData.code}
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

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
  Select,
} from '@uc-frontend/common';
import { useUuid } from '../hooks';

interface PropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Property {
  id: string;
  type: string;
  value: string;
}

export const PropertiesModal = ({ isOpen, onClose }: PropertiesModalProps) => {
  const t = useTranslation('system');
  const makeTmpId = useUuid();

  const [properties, setProperties] = useState<Property[]>([
    {
      id: makeTmpId(),
      type: '',
      value: '',
    },
  ]);

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
      key: 'type',
      width: '50%',
      label: 'label.type',
      sortable: false,
      Cell: ({ rowData }) => (
        <Select
          fullWidth
          required
          value={rowData.type}
          onChange={e => onChange({ ...rowData, type: e.target.value })}
          options={[
            // TODO: should be managed as editable config
            { label: t('property-code_rxnav'), value: 'code_rxnav' },
            { label: t('property-code_nzulm'), value: 'code_nzulm' },
            { label: t('property-who_eml'), value: 'who_eml' },
            { label: t('property-code_unspsc'), value: 'code_unspsc' },
          ]}
          InputLabelProps={{ shrink: true }}
        />
      ),
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
              // onUpdate
              onClose();
            }}
            isLoading={false}
            startIcon={<ArrowRightIcon />}
            sx={{ marginLeft: 1 }}
          >
            {t('label.add-properties')}
          </LoadingButton>
        }
        cancelButton={<DialogButton variant="cancel" onClick={onClose} />}
        title={t('label.add-properties')}
      >
        {/* show title for drug name//level */}
        <Box>
          <DataTable columns={columns} data={properties} />
        </Box>
      </Modal>
    </TableProvider>
  );
};

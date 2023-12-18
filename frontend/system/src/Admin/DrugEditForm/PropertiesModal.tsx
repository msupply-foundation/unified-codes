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
  FlatButton,
  PlusCircleIcon,
  MenuItem,
  Option,
  Typography,
} from '@uc-frontend/common';
import { useUuid } from '../../hooks';
import { Property } from './types';

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

  const makeNewPropertyRow = () => {
    return {
      // just a throwaway id... a dgraph uid will be assigned when the property is stored
      id: uuid(),
      type: '',
      value: '',
    };
  };

  const [properties, setProperties] = useState<Property[]>(
    data ?? [makeNewPropertyRow()]
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
      key: 'type',
      width: '50%',
      label: 'label.type',
      sortable: false,
      Cell: ({ rowData, rows }) => (
        <Select
          autoFocus
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
          renderOption={(option: Option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={!!rows.find(p => p.type === option.value)}
            >
              {option.label}
            </MenuItem>
          )}
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
              onSave(properties);
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
          <FlatButton
            startIcon={<PlusCircleIcon />}
            label={t('label.add-property')}
            onClick={() => onChange(makeNewPropertyRow())}
            disableFocusRipple
            sx={{
              marginLeft: '20px',
              '&.Mui-focusVisible': {
                backgroundColor: '#e95c3029',
              },
            }}
          />
        </Box>
      </Modal>
    </TableProvider>
  );
};

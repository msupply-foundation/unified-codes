import React from 'react';
import { CellProps } from '../../../columns';
import { BasicTextInput } from 'frontend/common/src/ui/components';
import { RecordWithId } from 'frontend/common/src/types';
import { useBufferState, useDebounceCallback } from 'frontend/common/src/hooks';

export const NumberInputCell = <T extends RecordWithId>({
  rowData,
  column,
  rows,
  rowIndex,
  columnIndex,
  isDisabled = false,
}: CellProps<T>): React.ReactElement<CellProps<T>> => {
  const [buffer, setBuffer] = useBufferState(
    column.accessor({ rowData, rows })
  );
  const updater = useDebounceCallback(column.setter, [column.setter], 250);

  const autoFocus = rowIndex === 0 && columnIndex === 0;

  return (
    <BasicTextInput
      disabled={isDisabled}
      autoFocus={autoFocus}
      InputProps={{ sx: { '& .MuiInput-input': { textAlign: 'right' } } }}
      type="number"
      value={buffer}
      onChange={e => {
        const newValue = e.target.value;
        setBuffer(newValue);
        updater({ ...rowData, [column.key]: Number(newValue) });
      }}
    />
  );
};

import React from 'react';
import { CellProps } from '../../../columns';
import { NonNegativeNumberInput } from 'frontend/common/src/ui/components';
import { RecordWithId } from 'frontend/common/src/types';
import { useBufferState, useDebounceCallback } from 'frontend/common/src/hooks';

// where NonNegative is n >=0
export const NonNegativeIntegerCell = <T extends RecordWithId>({
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
    <NonNegativeNumberInput
      disabled={isDisabled}
      autoFocus={autoFocus}
      InputProps={{ sx: { '& .MuiInput-input': { textAlign: 'right' } } }}
      type="number"
      value={buffer}
      onChange={newValue => {
        const intValue = Math.round(newValue);
        setBuffer(intValue.toString());
        updater({ ...rowData, [column.key]: intValue });
      }}
    />
  );
};

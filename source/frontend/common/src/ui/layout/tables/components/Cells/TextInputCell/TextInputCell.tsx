import React from 'react';
import { CellProps } from '../../../columns';
import { BasicTextInput } from 'frontend/common/src/ui/components';
import { RecordWithId } from 'frontend/common/src/types';
import { useBufferState, useDebounceCallback } from 'frontend/common/src/hooks';

export const TextInputCell = <T extends RecordWithId>({
  rowData,
  column,
  rows,
  isDisabled = false,
}: CellProps<T>): React.ReactElement<CellProps<T>> => {
  const [buffer, setBuffer] = useBufferState(
    column.accessor({ rowData, rows })
  );
  const updater = useDebounceCallback(column.setter, [column.setter], 500);
  const { maxLength } = column;

  return (
    <BasicTextInput
      disabled={isDisabled}
      InputProps={maxLength ? { inputProps: { maxLength } } : undefined}
      value={buffer}
      onChange={e => {
        const newValue = e.target.value;
        setBuffer(newValue);
        updater({ ...rowData, [column.key]: newValue });
      }}
    />
  );
};

import React from 'react';
import { CellProps } from '../../../columns';
import { Checkbox } from 'frontend/common/src/ui/components';
import { RecordWithId } from 'frontend/common/src/types';
import { useBufferState } from 'frontend/common/src/hooks';

export const CheckboxCell = <T extends RecordWithId>({
  rowData,
  column,
  rows,
  isDisabled,
}: CellProps<T>): React.ReactElement<CellProps<T>> => {
  const [buffer, setBuffer] = useBufferState(
    column.accessor({ rowData, rows })
  );

  return (
    <Checkbox
      disabled={isDisabled}
      checked={!!buffer}
      size="small"
      onChange={e => {
        const newValue = e.target.checked;
        setBuffer(newValue);
        column.setter({ ...rowData, [column.key]: newValue });
      }}
    />
  );
};

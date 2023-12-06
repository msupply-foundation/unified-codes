import React from 'react';
import { RecordWithId } from 'frontend/common/src/types';
import { ColumnAlign, ColumnDefinition } from '../types';
import { MessageSquareIcon } from 'frontend/common/src/ui/icons';
import {
  PaperHoverPopover,
  PaperPopoverSection,
} from 'frontend/common/src/ui/components';
import { useTranslation } from 'frontend/common/src/intl';

export const getCommentPopoverColumn = <T extends RecordWithId>(
  label?: string
): ColumnDefinition<T> => ({
  key: 'comment',
  sortable: false,
  align: ColumnAlign.Center,
  width: 60,
  Header: () => {
    return null;
  },

  Cell: ({ column, rowData, rows }) => {
    const t = useTranslation('common');
    const value = column.accessor({ rowData, rows });

    return value ? (
      <PaperHoverPopover
        width={400}
        Content={
          <PaperPopoverSection label={label ?? t('label.comment')}>
            {String(value)}
          </PaperPopoverSection>
        }
      >
        <MessageSquareIcon sx={{ fontSize: 16 }} color="primary" />
      </PaperHoverPopover>
    ) : null;
  },
});

import React, { FC } from 'react';
import { Box, Typography, Pagination } from '@mui/material';
import { useTableStore } from '../../context';
import { useTranslation } from '@common/intl';

interface PaginationRowProps {
  offset: number;
  first: number;
  total: number;
  page: number;
  onChange: (page: number) => void;
}

export const PaginationRow: FC<PaginationRowProps> = ({
  page,
  offset,
  first,
  total,
  onChange,
}) => {
  const { numberSelected } = useTableStore();

  // Offset is zero indexed, but should display one indexed for
  // users.
  const xToY = `${offset + 1}-${Math.min(first + offset, total)}`;

  const onChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    // The type here is broken and `value` can be `null`!

    const isValidPage = !!value;

    if (isValidPage) {
      const zeroIndexedPageNumber = value - 1;
      onChange(zeroIndexedPageNumber);
    }
  };

  const t = useTranslation('common');
  const getNumberSelectedLabel = () =>
    !!numberSelected && `(${numberSelected} ${t('label.selected')})`;

  // Pages are zero indexed. The Pagination component wants the page as
  // one-indexed.
  const displayPage = page + 1;

  return (
    <Box
      display="flex"
      flexDirection="row"
      height="48px"
      minHeight="48px"
      justifyContent="space-between"
      alignItems="center"
      boxShadow="inset 0 0.5px 0 0 rgba(143, 144, 166, 0.5)"
      padding="0px 8px 0px 20px"
    >
      {!!total && (
        <>
          <Box display="flex" flexDirection="row" flexWrap="wrap" flex={1}>
            <Typography sx={{ marginRight: '4px' }}>
              {t('label.showing')}
            </Typography>
            <Typography sx={{ fontWeight: 'bold', marginRight: '4px' }}>
              {xToY}
            </Typography>
            <Typography sx={{ marginRight: '4px' }}>{t('label.of')}</Typography>
            <Typography sx={{ fontWeight: 'bold', marginRight: '4px' }}>
              {total}
            </Typography>
            {!!numberSelected && (
              <Typography sx={{ fontWeight: 'bold', marginRight: '4px' }}>
                {getNumberSelectedLabel()}
              </Typography>
            )}
          </Box>

          <Pagination
            size="small"
            page={displayPage}
            onChange={onChangePage}
            count={Math.ceil(total / first)}
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: theme => theme.typography.body1.fontSize,
              },
            }}
          />
        </>
      )}
    </Box>
  );
};

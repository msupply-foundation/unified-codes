import * as React from 'react';

import { Entity, IPaginatedResults } from '@unified-codes/data';

import EntityTable from '../molecules/EntityTable';
import Grid from '../../layout/atoms/Grid';
import SearchBar from '../../inputs/molecules/SearchBar';
import TablePagination from '@material-ui/core/TablePagination';
import { IPaginationRequest } from '@unified-codes/data';

export interface EntityBrowserProps {
  data: IPaginatedResults<Entity>;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onFetch?: (request: IPaginationRequest) => void;
  onSearch?: (value: string) => void;
}

export type EntityBrowser = React.FunctionComponent<EntityBrowserProps>;
type RowsPerPageEvent = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;
type MouseEvent = React.MouseEvent<HTMLButtonElement> | null;

export const EntityBrowser: EntityBrowser = ({ data, onChange, onClear, onFetch, onSearch }) => {
  const [input, setInput] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const onChangeInput = React.useCallback(
    (input: string) => {
      setInput(input);
      onChange && onChange(input);
    },
    [setInput]
  );

  const handleChangePage = (_: MouseEvent, newPage: number) => {
    setPage(newPage);
    handleFetch(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event: RowsPerPageEvent) => {
    const rowsPerPage = +event.target.value;
    setRowsPerPage(rowsPerPage);
    setPage(0);
    handleFetch(0, rowsPerPage);
  };

  const handleFetch = (page: number, rowsPerPage: number) => {
    onFetch({ page, rowsPerPage });
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <SearchBar input={input} onChange={onChangeInput} onClear={onClear} onSearch={onSearch} />
      </Grid>
      <Grid item style={{ maxHeight: 400, overflow: 'scroll' }}>
        <EntityTable data={data.entities} />
      </Grid>
      <Grid item>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.totalResults}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Grid>
    </Grid>
  );
};

export default EntityBrowser;

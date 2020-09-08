import * as React from 'react';

import { Entity, IPaginatedResults } from '@unified-codes/data';

import EntityTable from '../molecules/EntityTable';
import Grid from '../../layout/atoms/Grid';
import SearchBar from '../../inputs/molecules/SearchBar';
import TablePagination from '@material-ui/core/TablePagination';
import { IPaginationRequest, PaginationRequest } from '@unified-codes/data';

export interface EntityBrowserProps {
  entities: IPaginatedResults<Entity>;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onFetch?: (request: IPaginationRequest) => void;
  onSearch?: (value: string) => void;
}

export type EntityBrowser = React.FunctionComponent<EntityBrowserProps>;
type RowsPerPageEvent = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;
type MouseEvent = React.MouseEvent<HTMLButtonElement> | null;

export const EntityBrowser: EntityBrowser = ({
  entities,
  onChange,
  onClear,
  onFetch,
  onSearch,
}) => {
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
    const request = new PaginationRequest(rowsPerPage, newPage * rowsPerPage);
    onFetch && onFetch(request);
  };

  const handleChangeRowsPerPage = (event: RowsPerPageEvent) => {
    const rowsPerPage = +event.target.value;
    setRowsPerPage(rowsPerPage);
    setPage(0);
    const request = new PaginationRequest(rowsPerPage);
    onFetch && onFetch(request);
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <SearchBar input={input} onChange={onChangeInput} onClear={onClear} onSearch={onSearch} />
      </Grid>
      <Grid item style={{ maxHeight: 400, overflow: 'scroll' }}>
        <EntityTable data={entities.data} />
      </Grid>
      <Grid item>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={entities.totalResults}
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

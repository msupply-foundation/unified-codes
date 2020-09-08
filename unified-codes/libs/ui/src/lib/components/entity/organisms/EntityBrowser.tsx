import * as React from 'react';

import { Entity, IPaginatedResults } from '@unified-codes/data';

import EntityTable from '../molecules/EntityTable';
import Grid from '../../layout/atoms/Grid';
import SearchBar from '../../inputs/molecules/SearchBar';
import TablePagination from '@material-ui/core/TablePagination';
import { EntitySearchFilter, EntitySearchRequest, IEntitySearchRequest } from '@unified-codes/data';

export interface EntityBrowserProps {
  data: IPaginatedResults<Entity>;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onSearch?: (request: IEntitySearchRequest) => void;
}

export type EntityBrowser = React.FunctionComponent<EntityBrowserProps>;
type RowsPerPageEvent = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;
type MouseEvent = React.MouseEvent<HTMLButtonElement> | null;

export const EntityBrowser: EntityBrowser = ({ data, onChange, onClear, onSearch }) => {
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
    const filter = new EntitySearchFilter(input);
    const request = new EntitySearchRequest(filter, rowsPerPage, newPage * rowsPerPage);
    onSearch && onSearch(request);
  };

  const handleChangeRowsPerPage = (event: RowsPerPageEvent) => {
    const rowsPerPage = +event.target.value;
    setRowsPerPage(rowsPerPage);
    setPage(0);
    const filter = new EntitySearchFilter(input);
    const request = new EntitySearchRequest(filter, rowsPerPage);
    onSearch && onSearch(request);
  };

  const handleSearch = (value: string) => {
    const filter = new EntitySearchFilter(value);
    const request = new EntitySearchRequest(filter, rowsPerPage, page * rowsPerPage);
    onSearch && onSearch(request);
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <SearchBar
          input={input}
          onChange={onChangeInput}
          onClear={onClear}
          onSearch={handleSearch}
        />
      </Grid>
      <Grid item style={{ maxHeight: 400, overflow: 'scroll' }}>
        {data.totalResults ? <EntityTable data={data.entities} /> : <div>No Results</div>}
      </Grid>
      <Grid item>
        {data.totalResults && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={data.totalResults}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default EntityBrowser;

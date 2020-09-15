import * as React from 'react';

import {
  Table,
  TableProps,
  TableHead,
  TableHeadProps,
  TableBody,
  TableBodyProps,
} from '../../data';

import { IEntity, IExplorerVariables } from '@unified-codes/data';

import EntityTableHeader, { EntityTableHeaderProps } from './EntityTableHeader';
import EntityTableRow, { EntityTableRowProps } from './EntityTableRow';
export interface EntityTableProps {
  bodyProps?: TableBodyProps;
  data: Array<IEntity>;
  headProps?: TableHeadProps;
  headerProps?: EntityTableHeaderProps;
  rowProps?: EntityTableRowProps;
  tableProps?: TableProps;
  variables?: IExplorerVariables;
  onSort?: (value: string) => void;
}

export type EntityTable = React.FunctionComponent<EntityTableProps>;

export const EntityTable: EntityTable = ({
  tableProps,
  headProps,
  headerProps,
  bodyProps,
  rowProps,
  data,
  variables,
  onSort,
}: EntityTableProps) => {
  const mapEntity = (entity: IEntity, index: number) => {
    const localRowProps =
      tableProps?.stripedRows && tableProps?.alternatingRowColour
        ? { style: { backgroundColor: index % 2 ? tableProps?.alternatingRowColour : '' } }
        : undefined;

    return (
      <EntityTableRow
        key={entity.code}
        {...{
          ...rowProps,
          entity,
          rowProps: { ...localRowProps },
        }}
      ></EntityTableRow>
    );
  };

  const EntityTableRows = React.useCallback(
    () => <React.Fragment>{data.map(mapEntity)}</React.Fragment>,
    [rowProps, data]
  );
  const { stripedRows, alternatingRowColour, ...otherProps } = tableProps || {};
  return (
    <Table {...otherProps}>
      <TableHead {...headProps}>
        <EntityTableHeader
          {...headerProps}
          onSort={onSort}
          orderDesc={variables?.orderDesc}
          orderBy={variables?.orderBy}
        />
      </TableHead>
      <TableBody {...bodyProps}>
        <EntityTableRows />
      </TableBody>
    </Table>
  );
};

export default EntityTable;

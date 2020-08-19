import * as React from 'react';

import {
  Table,
  TableProps,
  TableHead,
  TableHeadProps,
  TableBody,
  TableBodyProps,
} from '../../data';

import { Entity } from '@unified-codes/data';

import EntityTableHeader, { EntityTableHeaderProps } from './EntityTableHeader';
import EntityTableRow, { EntityTableRowProps } from './EntityTableRow';
export interface EntityTableProps {
  tableProps?: TableProps;
  headProps?: TableHeadProps;
  headerProps?: EntityTableHeaderProps;
  bodyProps?: TableBodyProps;
  rowProps?: EntityTableRowProps;
  data: Entity[];
}

export type EntityTable = React.FunctionComponent<EntityTableProps>;

export const EntityTable: EntityTable = ({
  tableProps,
  headProps,
  headerProps,
  bodyProps,
  rowProps,
  data,
}: {
  tableProps: TableProps;
  headProps: TableHeadProps;
  headerProps: EntityTableHeaderProps;
  bodyProps: TableBodyProps;
  rowProps: EntityTableRowProps;
  data: Entity[];
}) => {
  const mapEntity = (entity: Entity) => (
    <EntityTableRow key={entity.code} {...{ ...rowProps, entity }}></EntityTableRow>
  );

  const EntityTableRows = React.useCallback(
    () => <React.Fragment>{data.map(mapEntity)}</React.Fragment>,
    [rowProps, data]
  );

  return (
    <Table {...tableProps}>
      <TableHead {...headProps}>
        <EntityTableHeader {...headerProps} />
      </TableHead>
      <TableBody {...bodyProps}>
        <EntityTableRows />
      </TableBody>
    </Table>
  );
};

export default EntityTable;
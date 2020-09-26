import * as React from 'react';

import { IEntity, EEntityField } from '@unified-codes/data';

import Grid from '../../layout/atoms/Grid';
import EntityTableRow, { IEntityTableRowClasses } from './EntityTableRow';

export interface IEntityTableRowsClasses {
    root?: string,
    rowPrimary?: string,
    rowSecondary?: string,
    cell?: string,
}

export interface EntityTableRowsProps  {
  classes?: IEntityTableRowsClasses;
  columns: EEntityField[];
  entities: IEntity[];
}

export type EntityTableRows = React.FunctionComponent<EntityTableRowsProps>;

export const EntityTableRows: EntityTableRows = ({ classes, columns, entities }) => {
    const rows = React.useMemo(() => 
        entities.map((entity: IEntity, index: number) => (
            <EntityTableRow
                classes={{
                    root: index % 2 ? classes?.rowPrimary : classes?.rowSecondary,
                    cell: classes?.cell
                }}
                columns={columns}
                entity={entity}
                key={entity.code}
            ></EntityTableRow>
        )
      ), [classes, columns, entities]);

  return <Grid classes={{root: classes?.root}}>{rows}</Grid>;
};

export default EntityTableRows;
import * as React from 'react';

import { IEntity, EEntityField } from '@unified-codes/data';

import EntityTableRow from './EntityTableRow';

export interface IEntityTableRowsClasses {
    root?: string,
    rowPrimary?: string,
    rowSecondary?: string,
    cell?: string,
}

export interface IEntityTableRowsProps  {
  classes?: IEntityTableRowsClasses;
  columns: EEntityField[];
  entities: IEntity[];
  onSelect: (entity: IEntity) => void;
}

export type EntityTableRows = React.FunctionComponent<IEntityTableRowsProps>;

export const EntityTableRows: EntityTableRows = ({ classes, columns, entities, onSelect }) => {
    const rows = React.useMemo(() => 
        entities.map((entity: IEntity, index: number) => (
            <EntityTableRow
                classes={{
                    root: index % 2 ? classes?.rowPrimary : classes?.rowSecondary,
                    cell: classes?.cell
                }}
                columns={columns}
                entity={entity}
                onSelect={onSelect}
                key={entity.code}
            ></EntityTableRow>
        )
      ), [classes, columns, entities]);

  return <React.Fragment>{rows}</React.Fragment>;
};

export default EntityTableRows;
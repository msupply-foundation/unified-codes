import * as React from 'react';

import { IEntity } from '@unified-codes/data';

export interface EntityDetailListItemProps {
  entity: IEntity;
}

export type EntityDetailListItem = React.FunctionComponent<EntityDetailListItemProps>;

export const EntityDetailListItem: EntityDetailListItem = ({ entity }) => {
  return (
  <li key={entity.description}>
    {entity.description} {`(code:${entity.code})`}
    <ul>
      {entity.has_child?.map((child) => {
        return <EntityDetailListItem entity={child} />
      })}
    </ul>
  </li>);
};

export default EntityDetailListItem;

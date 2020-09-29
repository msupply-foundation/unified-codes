import * as React from 'react';

import { IEntity } from '@unified-codes/data';

export interface EntityDetailCategoryItemProps {
  entity: IEntity;
}

export type EntityDetailCategoryItem = React.FunctionComponent<EntityDetailCategoryItemProps>;

export const EntityDetailCategoryItem: EntityDetailCategoryItem = ({ entity }) => {
  return (
    <li>
      {entity.description} {`(code:${entity.code})`}
      {entity.has_child ? (
        <ul>
          {entity.has_child.map((child) => (
            <EntityDetailCategoryItem entity={child} key={child.description} />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

export default EntityDetailCategoryItem;

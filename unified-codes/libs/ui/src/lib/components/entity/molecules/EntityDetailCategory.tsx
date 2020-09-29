import * as React from 'react';

import { IEntity } from '@unified-codes/data';

export interface EntityDetailCategoryProps {
  entity: IEntity;
}

export type EntityDetailCategory = React.FunctionComponent<EntityDetailCategoryProps>;

export const EntityDetailCategory: EntityDetailCategory = ({ entity }) => {
  return (
    <li>
      {entity.description} {`(code:${entity.code})`}
      {entity.has_child ? (
        <ul>
          {entity.has_child.map((child) => (
            <EntityDetailCategory entity={child} key={child.description} />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

export default EntityDetailCategory;

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
      {entity.children ? (
        <ul>
          {entity.children.map((child) => (
            <EntityDetailCategory entity={child} key={child.description} />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

export default EntityDetailCategory;

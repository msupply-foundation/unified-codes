import * as React from 'react';

import { IEntity } from '@unified-codes/data';

export interface EntityDetailCategoryItemProps {
  entity: IEntity;
}

export type EntityDetailCategoryItem = React.FunctionComponent<EntityDetailCategoryItemProps>;

export const EntityDetailCategoryItem: EntityDetailCategoryItem = ({ entity }) => {
  return (
    <li key={entity.description}>
      {entity.description} {`(code:${entity.code})`}
      <ul>
        {entity.has_child?.map((child) => {
          return <EntityDetailCategoryItem entity={child} />;
        })}
      </ul>
    </li>
  );
};

export default EntityDetailCategoryItem;

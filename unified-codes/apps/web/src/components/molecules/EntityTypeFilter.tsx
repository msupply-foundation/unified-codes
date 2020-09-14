import * as React from 'react';
import { ToggleButtonGroup } from '@unified-codes/ui';

export type EntityTypeFilter = React.FunctionComponent;

export const EntityTypeFilter: EntityTypeFilter = () => {
  const [entityStates, entityStateChange] = React.useState([
    { name: 'Drugs', active: true },
    { name: 'Unit of Use', active: false },
    { name: 'Other', active: false },
  ]);

  return (
    <ToggleButtonGroup
      onToggle={(clickedEntity: { name: string; active: boolean }) => {
        const newEntityStates = entityStates.map((entityItem) => {
          if (entityItem === clickedEntity) {
            return { ...entityItem, active: !entityItem.active };
          } else {
            return { ...entityItem };
          }
        });
        entityStateChange(newEntityStates);
      }}
      toggleItems={entityStates}
    />
  );
};

export default EntityTypeFilter;

import * as React from 'react';
import { ToggleButtonGroup } from '../../inputs/molecules/ToggleButtonGroup';

export interface IEntityType {
  active: boolean;
  name: string;
}

export interface IEntityTypeFilterProps {
  className?: string;
  types: Array<IEntityType>;
  onChange?: (entityTypes: Array<IEntityType>) => void;
}

export type EntityTypeFilter = React.FunctionComponent<IEntityTypeFilterProps>;

export const EntityTypeFilter: EntityTypeFilter = ({ className, onChange, types }) => {
  const [entityStates, entityStateChange] = React.useState(types);

  const handleToggle = (clickedEntity: { name: string; active: boolean }) => {
    const newEntityStates = entityStates.map((entityItem) => {
      if (entityItem === clickedEntity) {
        return { ...entityItem, active: !entityItem.active };
      } else {
        return { ...entityItem };
      }
    });
    entityStateChange(newEntityStates);
    onChange && onChange(newEntityStates);
  };

  return (
    <ToggleButtonGroup className={className} onToggle={handleToggle} toggleItems={entityStates} />
  );
};

export default EntityTypeFilter;

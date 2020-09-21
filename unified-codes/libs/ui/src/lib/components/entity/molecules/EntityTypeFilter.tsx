import * as React from 'react';
import { ToggleButtonGroup, IToggleItem } from '../../inputs/molecules/ToggleButtonGroup';

export interface IEntityTypeFilterProps {
  classes?: {
    root: string,
    toggleButtonActive?: string,
    toggleButtonInactive?: string,
    toggleButtonGroup?: string,
  };
  types: Array<IToggleItem>;
}

export type EntityTypeFilter = React.FunctionComponent<IEntityTypeFilterProps>;

export const EntityTypeFilter: EntityTypeFilter = ({ classes, types }) => {
  const [entityStates, entityStateChange] = React.useState(types);

  return (
    <ToggleButtonGroup
      classes={{
        root: classes?.toggleButtonGroup,
        toggleButtonActive: classes?.toggleButtonActive,
        toggleButtonInactive: classes?.toggleButtonInactive,
      }}
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

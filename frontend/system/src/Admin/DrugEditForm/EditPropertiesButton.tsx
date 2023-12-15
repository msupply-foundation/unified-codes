import React from 'react';
import { useTranslation } from '@common/intl';
import { AngleCircleRightIcon, IconButton, PlusCircleIcon } from '@common/ui';
import { Entity } from './types';

export const EditPropertiesButton = ({
  parents,
  entity,
  onOpen,
}: {
  onOpen: (modalTitle: string, entityToUpdate: Entity) => void;
  parents: Entity[];
  entity: Entity;
}) => {
  const t = useTranslation('system');

  const hasProperties = !!entity.properties?.length;

  const modalTitle = [...parents, entity].map(e => e.name).join(' - ');

  return (
    <IconButton
      icon={hasProperties ? <AngleCircleRightIcon /> : <PlusCircleIcon />}
      label={t('label.add-properties')}
      onClick={e => {
        // move focus away from the button, otherwise keyboard interactions in the modal do strange things
        e.currentTarget.blur();

        onOpen(modalTitle, entity);
      }}
      color="primary"
    />
  );
};

import { EntityDetailsFragment } from './api/operations.generated';

export type EntityData = EntityDetailsFragment & {
  children?: EntityData[] | null;
};

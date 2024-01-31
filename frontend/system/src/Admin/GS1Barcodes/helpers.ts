import { EntityType } from '../../constants';
import {
  EntityWithGs1sFragment,
  Gs1Fragment,
} from './api/operations.generated';

export type EntityWithGs1Details = EntityWithGs1sFragment & {
  children?: EntityWithGs1Details[];
};

export const getParentDescription = ({
  description,
  name,
}: {
  description: string;
  name: string;
}) => {
  const nameIndex = description.lastIndexOf(name);
  if (nameIndex === -1) return description;
  return description.substring(0, nameIndex).trim();
};

export const getPackSizeCodes = (entity?: EntityWithGs1Details | null) => {
  const packSizeCodes: string[] = [];

  if (!entity) return packSizeCodes;

  if (entity.type === EntityType.PackSize) {
    packSizeCodes.push(entity.code);
  }

  const addChildCodes = (e: EntityWithGs1Details) => {
    e.children?.forEach(c => {
      if (c.type === EntityType.PackSize) {
        packSizeCodes.push(c.code);
      }
      addChildCodes(c);
    });
  };

  addChildCodes(entity);
  return packSizeCodes;
};

// GS1s for entity and all its children (though there should only be GS1s on PackSize entities, the lowest level...)
export const getGS1Barcodes = (entity: EntityWithGs1Details) => {
  const barcodes: Omit<Gs1Fragment, '__typename'>[] = [];

  const addBarcodes = (e: EntityWithGs1Details) =>
    e.gs1Barcodes.forEach(b => barcodes.push({ ...b, entity: e }));

  addBarcodes(entity);

  const addChildBarcodes = (e: EntityWithGs1Details) => {
    e.children?.forEach(c => {
      addBarcodes(c);
      addChildBarcodes(c);
    });
  };

  addChildBarcodes(entity);

  return barcodes;
};

import { EntityType } from '../../constants';
import {
  BarcodeFragment,
  EntityWithBarcodesFragment,
} from './api/operations.generated';

export type EntityWithBarcodes = EntityWithBarcodesFragment & {
  children?: EntityWithBarcodes[];
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

export const getPackSizeCodes = (entity?: EntityWithBarcodes | null) => {
  const packSizeCodes: string[] = [];

  if (!entity) return packSizeCodes;

  if (entity.type === EntityType.PackSize) {
    packSizeCodes.push(entity.code);
  }

  const addChildCodes = (e: EntityWithBarcodes) => {
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

// Barcodes for entity and all its children (though there should only be barcodes on PackSize entities, the lowest level...)
export const getBarcodes = (entity: EntityWithBarcodes) => {
  const barcodes: Omit<BarcodeFragment, '__typename'>[] = [];

  const addBarcodes = (e: EntityWithBarcodes) =>
    e.barcodes.forEach(b => barcodes.push({ ...b, entity: e }));

  addBarcodes(entity);

  const addChildBarcodes = (e: EntityWithBarcodes) => {
    e.children?.forEach(c => {
      addBarcodes(c);
      addChildBarcodes(c);
    });
  };

  addChildBarcodes(entity);

  return barcodes;
};

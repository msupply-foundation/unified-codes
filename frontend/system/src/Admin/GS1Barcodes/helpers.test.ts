import { EntityType } from '../../constants';
import {
  getParentDescription,
  getPackSizeCodes,
  EntityWithGs1Details,
  getGS1Barcodes,
} from './helpers';

describe('getParentDescription', () => {
  it('returns full description when name doesnt match', () => {
    expect(
      getParentDescription({ description: 'some description', name: 'name' })
    ).toEqual('some description');
  });

  it('returns description with name removed', () => {
    expect(
      getParentDescription({
        description: 'some description name',
        name: 'name',
      })
    ).toEqual('some description');
  });

  it('returns description correctly when name is also in the middle', () => {
    expect(
      getParentDescription({
        description: 'description name bla name',
        name: 'name',
      })
    ).toEqual('description name bla');
  });
});

describe('getPackSizeCodes', () => {
  it('returns an empty array when entity type is not PackSize', () => {
    const entity: EntityWithGs1Details = {
      type: EntityType.ActiveIngredients,
      code: '123',
      name: '123',
      description: '123',
      gs1Barcodes: [],
      children: [
        {
          type: EntityType.Brand,
          code: '456',
          name: '456',
          description: '456',
          gs1Barcodes: [],
          children: [
            {
              type: EntityType.Strength,
              code: '789',
              name: '789',
              description: '789',
              gs1Barcodes: [],
            },
          ],
        },
      ],
    };

    expect(getPackSizeCodes(entity)).toEqual([]);
  });

  it('returns an array with the entity code which entity type is PackSize', () => {
    const entity: EntityWithGs1Details = {
      type: EntityType.PackSize,
      code: '123',
      name: '123',
      description: '123',
      gs1Barcodes: [],
    };

    expect(getPackSizeCodes(entity)).toEqual(['123']);
  });

  it('returns an array with the child entity codes where entity type is PackSize', () => {
    const entity: EntityWithGs1Details = {
      type: EntityType.ImmediatePackaging,
      code: '123',
      name: '123',
      description: '123',
      gs1Barcodes: [],
      children: [
        {
          type: EntityType.PackSize,
          code: '456',
          name: '456',
          description: '456',
          gs1Barcodes: [],
        },
        {
          type: EntityType.PackSize,
          code: '789',
          name: '789',
          description: '789',
          gs1Barcodes: [],
        },
      ],
    };

    expect(getPackSizeCodes(entity)).toEqual(['456', '789']);
  });
});

describe('getGS1Barcodes', () => {
  it('returns an empty array when entity has no GS1 barcodes', () => {
    const entity: EntityWithGs1Details = {
      type: EntityType.Unit,
      code: '123',
      name: '123',
      description: '123',
      gs1Barcodes: [],
    };

    expect(getGS1Barcodes(entity)).toEqual([]);
  });

  it('returns an array with the entity GS1 barcodes', () => {
    const entity: EntityWithGs1Details = {
      type: EntityType.PackSize,
      code: '123',
      name: '123',
      description: '123',
      gs1Barcodes: [
        { id: '1234567890', gtin: '1234567890', manufacturer: 'X' },
        { id: '0987654321', gtin: '0987654321', manufacturer: 'Y' },
      ],
    };

    expect(getGS1Barcodes(entity)).toEqual([
      { id: '1234567890', gtin: '1234567890', manufacturer: 'X', entity },
      { id: '0987654321', gtin: '0987654321', manufacturer: 'Y', entity },
    ]);
  });

  it('returns an array with the entity and child GS1 barcodes', () => {
    const entity = {
      type: EntityType.ImmediatePackaging,
      code: '123',
      name: '123',
      description: '123',
      gs1Barcodes: [],
      children: [
        {
          type: EntityType.PackSize,
          code: '456',
          name: '456',
          description: '456',
          gs1Barcodes: [
            { id: '1234567890', gtin: '1234567890', manufacturer: 'X' },
            { id: '0987654321', gtin: '0987654321', manufacturer: 'Y' },
          ],
        },
        {
          type: EntityType.PackSize,
          code: '789',
          name: '789',
          description: '789',
          gs1Barcodes: [
            { id: '1111111111', gtin: '1111111111', manufacturer: 'X' },
            { id: '2222222222', gtin: '2222222222', manufacturer: 'Y' },
          ],
        },
      ],
    };

    expect(getGS1Barcodes(entity)).toEqual([
      {
        id: '1234567890',
        gtin: '1234567890',
        manufacturer: 'X',
        entity: entity.children[0],
      },
      {
        id: '0987654321',
        gtin: '0987654321',
        manufacturer: 'Y',
        entity: entity.children[0],
      },
      {
        id: '1111111111',
        gtin: '1111111111',
        manufacturer: 'X',
        entity: entity.children[1],
      },
      {
        id: '2222222222',
        gtin: '2222222222',
        manufacturer: 'Y',
        entity: entity.children[1],
      },
    ]);
  });
});

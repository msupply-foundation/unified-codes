import { ColumnDefinitionSetBuilder } from './ColumnDefinitionSetBuilder';
import { RecordWithId } from '@common/types';

interface SomeTestItem extends RecordWithId {
  id: string;
  description: string;
  status: string;
}

describe('ColumnDefinitionSetBuilder', () => {
  it('Creates an array of columns for the column keys passed', () => {
    const columns = new ColumnDefinitionSetBuilder<SomeTestItem>()
      .addColumn('description')
      .addColumn('status')
      .build();

    expect(columns).toEqual([
      expect.objectContaining({ key: 'description' }),
      expect.objectContaining({ key: 'status' }),
    ]);
  });

  it('creates an array of column objects when passed column definitions rather than keys', () => {
    const columns = new ColumnDefinitionSetBuilder<SomeTestItem>()
      .addColumn({ key: 'status' })
      .addColumn({ key: 'description' })
      .build();

    expect(columns).toEqual([
      expect.objectContaining({ key: 'status' }),
      expect.objectContaining({ key: 'description' }),
    ]);
  });

  it('creates an array of column objects when passed a mix of column definitions and keys', () => {
    const columns = new ColumnDefinitionSetBuilder<SomeTestItem>()
      .addColumn('type')
      .addColumn({ key: 'status' })
      .addColumn({ key: 'description' })
      .build();

    expect(columns).toEqual([
      expect.objectContaining({ key: 'type' }),
      expect.objectContaining({ key: 'status' }),
      expect.objectContaining({ key: 'description' }),
    ]);
  });

  it('creates an array of column objects in the order they were specified', () => {
    const columns = new ColumnDefinitionSetBuilder<SomeTestItem>()
      .addColumn('type', { order: 3 })
      .addColumn({ key: 'status', order: 2 })
      .addColumn({ key: 'description', order: 1 })
      .build();

    expect(columns).toEqual([
      expect.objectContaining({ key: 'description' }),
      expect.objectContaining({ key: 'status' }),
      expect.objectContaining({ key: 'type' }),
    ]);
  });

  it('creates an array of column objects with columns in their specified order, and all others appended to the tail', () => {
    const columns = new ColumnDefinitionSetBuilder<SomeTestItem>()
      .addColumn('type', { order: 0 })
      .addColumn({ key: 'status' })
      .addColumn({ key: 'description' })
      .addColumn('selection', { order: 3 })
      .addColumn('name', { order: 1 })
      .build();

    expect(columns).toEqual([
      expect.objectContaining({ key: 'type' }),
      expect.objectContaining({ key: 'name' }),
      expect.objectContaining({ key: 'selection' }),
      expect.objectContaining({ key: 'status' }),
      expect.objectContaining({ key: 'description' }),
    ]);
  });

  it('overrides the default values of a column with the passed options', () => {
    const columns = new ColumnDefinitionSetBuilder<SomeTestItem>()
      .addColumn('type', { width: 300 })
      .addColumn('status', { width: 300, label: 'admin' })
      .build();

    expect(columns).toEqual([
      { key: 'type', width: 300, label: 'label.type', order: 100 },
      { key: 'status', width: 300, label: 'admin', order: 101 },
    ]);
  });
});

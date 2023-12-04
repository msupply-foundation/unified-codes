import { getCheckboxSelectionColumn } from '../columns/CheckboxSelectionColumn';
import { RecordWithId } from '@common/types';
import { ColumnDefinition } from '../columns/types';

const createColumn = <T extends RecordWithId>(
  column: ColumnDefinition<T>
): ColumnDefinition<T> => {
  return column;
};

export type ColumnKey =
  | 'type'
  | 'status'
  | 'name'
  | 'selection'
  | 'description';

const getColumnLookup = <T extends RecordWithId>(): Record<
  ColumnKey,
  ColumnDefinition<T>
> => ({
  name: {
    key: 'name',
    label: 'label.name',
    width: 75,
  },
  type: {
    label: 'label.type',
    key: 'type',
    width: 150,
  },
  status: {
    label: 'label.status',
    key: 'status',
    width: 75,
  },
  description: {
    label: 'label.description',
    key: 'description',
    width: 250,
  },
  selection: getCheckboxSelectionColumn(),
});

export class ColumnDefinitionSetBuilder<T extends RecordWithId> {
  columns: ColumnDefinition<T>[];

  currentOrder: number;

  constructor() {
    this.columns = [];
    this.currentOrder = 100;
  }

  private addOrder(column?: { order?: number }) {
    if (column?.order == null) {
      return this.currentOrder++;
    }

    return column.order;
  }

  addColumns(
    columnsToCreate: (
      | ColumnDefinition<T>
      | ColumnKey
      | [ColumnKey | ColumnDefinition<T>, Omit<ColumnDefinition<T>, 'key'>]
      | [ColumnKey]
    )[]
  ): ColumnDefinitionSetBuilder<T> {
    columnsToCreate.forEach(columnDescription => {
      if (Array.isArray(columnDescription)) {
        const columnKeyOrColumnDefinition = columnDescription[0];
        const maybeColumnOptions = columnDescription[1];
        this.addColumn(columnKeyOrColumnDefinition, maybeColumnOptions);
      } else {
        this.addColumn(columnDescription);
      }
    });

    return this;
  }

  addColumn(
    columnKeyOrColumnDefinition:
      | keyof ReturnType<typeof getColumnLookup>
      | ColumnDefinition<T>,
    maybeColumnOptions?: Omit<ColumnDefinition<T>, 'key'>
  ): ColumnDefinitionSetBuilder<T> {
    const usingColumnKey = typeof columnKeyOrColumnDefinition === 'string';

    let defaultColumnOptions;

    if (usingColumnKey) {
      defaultColumnOptions = getColumnLookup<T>()[columnKeyOrColumnDefinition];
    } else {
      defaultColumnOptions = columnKeyOrColumnDefinition;
    }

    const options = {
      ...defaultColumnOptions,
      ...maybeColumnOptions,
      order: this.addOrder(
        usingColumnKey ? maybeColumnOptions : columnKeyOrColumnDefinition
      ),
    };

    const key = usingColumnKey ? columnKeyOrColumnDefinition : options.key;

    this.columns.push(createColumn<T>({ ...options, key }));

    return this;
  }

  build(): ColumnDefinition<T>[] {
    this.currentOrder = 100;
    const sortedColumns = this.columns.sort((a, b) => {
      const { order: aOrder = 0 } = a;
      const { order: bOrder = 0 } = b;

      if (aOrder < bOrder) {
        return -1;
      } else {
        return 1;
      }
    });

    this.columns = [];

    return sortedColumns;
  }
}

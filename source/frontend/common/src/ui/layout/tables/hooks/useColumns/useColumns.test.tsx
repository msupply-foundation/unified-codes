import { renderHook } from '@testing-library/react';
import { ColumnAlign, ColumnFormat } from '../../columns';
import { useColumns } from './useColumns';
import { RecordWithId } from '@common/types';

interface Test extends RecordWithId {
  id: string;
}

describe('useColumns', () => {
  it('assigns sensible defaults for an unspecified column', () => {
    const { result } = renderHook(() => useColumns<Test>([{ key: 'default' }]));

    const defaults = {
      format: ColumnFormat.Text,
      sortable: false,
      sortInverted: false,
      sortDescFirst: false,
      align: ColumnAlign.Left,
    };

    expect(result.current[0]).toEqual(expect.objectContaining(defaults));
    expect(result.current[0]?.Cell).toBeTruthy();
    expect(result.current[0]?.Header).toBeTruthy();
    expect(result.current[0]?.accessor).toBeTruthy();
    expect(result.current[0]?.formatter).toBeTruthy();
  });

  it('assigns sensible defaults for an integer column', () => {
    const { result } = renderHook(() =>
      useColumns<Test>([{ key: 'default', format: ColumnFormat.Integer }])
    );

    const defaults = {
      format: ColumnFormat.Integer,
      sortable: false,
      sortInverted: false,
      sortDescFirst: false,
      align: ColumnAlign.Right,
    };

    expect(result.current[0]).toEqual(expect.objectContaining(defaults));
    expect(result.current[0]?.Cell).toBeTruthy();
    expect(result.current[0]?.Header).toBeTruthy();
    expect(result.current[0]?.accessor).toBeTruthy();
    expect(result.current[0]?.formatter).toBeTruthy();
  });

  it('assigns sensible defaults for a "real" type column', () => {
    const { result } = renderHook(() =>
      useColumns<Test>([{ key: 'default', format: ColumnFormat.Real }])
    );

    const defaults = {
      format: ColumnFormat.Real,
      sortable: false,
      sortInverted: false,
      sortDescFirst: false,
      align: ColumnAlign.Right,
    };

    expect(result.current[0]).toEqual(expect.objectContaining(defaults));
    expect(result.current[0]?.Cell).toBeTruthy();
    expect(result.current[0]?.Header).toBeTruthy();
    expect(result.current[0]?.accessor).toBeTruthy();
    expect(result.current[0]?.formatter).toBeTruthy();
  });

  it('assigns sensible defaults for a date type column', () => {
    const { result } = renderHook(() =>
      useColumns<Test>([{ key: 'default', format: ColumnFormat.Date }])
    );

    const defaults = {
      format: ColumnFormat.Date,
      sortable: false,
      sortInverted: true,
      sortDescFirst: true,
      align: ColumnAlign.Right,
    };

    expect(result.current[0]).toEqual(expect.objectContaining(defaults));
    expect(result.current[0]?.Cell).toBeTruthy();
    expect(result.current[0]?.Header).toBeTruthy();
    expect(result.current[0]?.accessor).toBeTruthy();
    expect(result.current[0]?.formatter).toBeTruthy();
  });

  it('uses the correct width and min width if specified', () => {
    const { result } = renderHook(() =>
      useColumns<Test>([{ key: 'default', width: 200, minWidth: 100 }])
    );

    const defaults = {
      width: 200,
      minWidth: 100,
    };

    expect(result.current[0]).toEqual(expect.objectContaining(defaults));
  });

  it('defaults to sortable when an onChangeSortBy is provided', () => {
    const { result } = renderHook(() =>
      useColumns<Test>([{ key: 'default' }], { onChangeSortBy: () => {} })
    );

    const defaults = {
      sortable: true,
    };

    expect(result.current[0]).toEqual(expect.objectContaining(defaults));
  });

  it('uses the correct width and min width if specified', () => {
    const { result } = renderHook(() =>
      useColumns<Test>([{ key: 'default', width: 200, minWidth: 100 }])
    );
    const defaults = { width: 200, minWidth: 100 };
    expect(result.current[0]).toEqual(expect.objectContaining(defaults));
  });

  it('has a stable reference when re-rendering', () => {
    const { result, rerender } = renderHook(() =>
      useColumns<Test>([{ key: 'default', format: ColumnFormat.Integer }])
    );
    const firstResult = result.current;
    rerender();
    const secondResult = result.current;
    expect(firstResult).toBe(secondResult);
  });
});

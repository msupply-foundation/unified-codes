import { act, renderHook } from '@testing-library/react';
import { useQueryParamsState } from './useQueryParamsState';
import { createColumnWithDefaults } from '../..';

describe('useQueryParamsState', () => {
  describe('initial', () => {
    it('returns default state when no params passed', () => {
      const { queryParams } = renderHook(useQueryParamsState).result.current;
      expect(queryParams).toEqual({
        page: 0,
        offset: 0,
        first: 20,
        sortBy: {
          key: '',
          direction: 'asc',
          isDesc: false,
        },
        filterBy: {},
      });
    });

    it('builds correct initial state from params', () => {
      const { queryParams } = renderHook(() =>
        useQueryParamsState({
          initialSort: { key: 'test-sort-key', dir: 'desc' },
          rowsPerPage: 100,
          initialFilter: {
            ['test-filter-key-1']: { like: 'like me!' },
            ['test-filter-key-2']: { like: 'this' },
          },
        })
      ).result.current;

      expect(queryParams).toEqual({
        page: 0,
        offset: 0,
        first: 100,
        sortBy: {
          key: 'test-sort-key',
          direction: 'desc',
          isDesc: true,
        },
        filterBy: {
          ['test-filter-key-1']: { like: 'like me!' },
          ['test-filter-key-2']: { like: 'this' },
        },
      });
    });
  });
  describe('updateSortQuery', () => {
    it('resets sort state when a new sort key is set', () => {
      const { result } = renderHook(() =>
        useQueryParamsState({
          initialSort: { key: 'initial-key', dir: 'desc' },
        })
      );

      const quantityColumn = createColumnWithDefaults({
        key: 'quantity',
      });
      act(() => result.current.updateSortQuery(quantityColumn));

      expect(result.current.queryParams.sortBy).toEqual({
        key: 'quantity',
        direction: 'asc',
        isDesc: false,
      });
    });
    it('sets dir to "asc" if not provided in column', () => {
      const { result } = renderHook(() =>
        useQueryParamsState({ initialSort: { key: 'quantity', dir: 'desc' } })
      );

      const quantityColumn = createColumnWithDefaults({
        key: 'quantity',
      });
      act(() => result.current.updateSortQuery(quantityColumn));

      expect(result.current.queryParams.sortBy).toEqual({
        key: 'quantity',
        direction: 'asc',
        isDesc: false,
      });
    });
    it('sets dir to opposite of existing column direction', () => {
      const { result } = renderHook(() =>
        useQueryParamsState({ initialSort: { key: 'quantity', dir: 'desc' } })
      );

      const quantityColumn = createColumnWithDefaults(
        { key: 'quantity' },
        { sortBy: { direction: 'desc', key: 'quantity' } }
      );
      act(() => result.current.updateSortQuery(quantityColumn));

      expect(result.current.queryParams.sortBy).toEqual({
        key: 'quantity',
        direction: 'asc',
        isDesc: false,
      });
    });
  });
  describe('updatePaginationQuery', () => {
    it('updates pagination on change of page number', () => {
      const { result } = renderHook(() => useQueryParamsState());

      act(() => result.current.updatePaginationQuery(4));

      expect(result.current.queryParams.page).toBe(4);
      expect(result.current.queryParams.offset).toBe(80);
    });
  });
  describe('updateFilterQuery', () => {
    it('adds new filter rule', () => {
      const { result } = renderHook(() =>
        useQueryParamsState({ initialFilter: { id: { equalTo: 'some-id' } } })
      );

      act(() => result.current.updateFilterQuery({ quantity: { like: '0' } }));

      expect(result.current.filter.filterBy).toEqual({
        id: { equalTo: 'some-id' },
        quantity: { like: '0' },
      });
    });
    it('updates existing filter rule', () => {
      const { result } = renderHook(() =>
        useQueryParamsState({ initialFilter: { id: { equalTo: 'some-id' } } })
      );

      act(() =>
        result.current.updateFilterQuery({ id: { like: 'some-other-id' } })
      );

      expect(result.current.filter.filterBy).toEqual({
        id: { like: 'some-other-id' },
      });
    });
  });

  describe('filter', () => {
    describe('onChangeStringRule', () => {
      it('clears filter rule when set to empty string', () => {
        const { result } = renderHook(() =>
          useQueryParamsState({ initialFilter: { id: 'some-id' } })
        );

        act(() => result.current.filter.onChangeStringRule('id', ''));

        expect(result.current.filter.filterBy).toEqual({});
      });

      it('sets new string rule', () => {
        const { result } = renderHook(() =>
          useQueryParamsState({ initialFilter: { id: { equalTo: 'some-id' } } })
        );

        act(() =>
          result.current.filter.onChangeStringRule('search', 'spongebob')
        );

        expect(result.current.filter.filterBy).toEqual({
          id: { equalTo: 'some-id' },
          search: 'spongebob',
        });
      });
    });

    describe('onChangeStringFilterRule', () => {
      it('clears filter rule when set to empty string', () => {
        const { result } = renderHook(() =>
          useQueryParamsState({ initialFilter: { id: { equalTo: 'some-id' } } })
        );

        act(() =>
          result.current.filter.onChangeStringFilterRule('id', 'equalTo', '')
        );

        expect(result.current.filter.filterBy).toEqual({});
      });

      it('sets new string filter rule', () => {
        const { result } = renderHook(() =>
          useQueryParamsState({ initialFilter: { id: { equalTo: 'some-id' } } })
        );

        act(() =>
          result.current.filter.onChangeStringFilterRule(
            'name',
            'like',
            'spongebob'
          )
        );

        expect(result.current.filter.filterBy).toEqual({
          id: { equalTo: 'some-id' },
          name: { like: 'spongebob' },
        });
      });
    });

    describe('onChangeStringArrayFilterRule', () => {
      it('clears filter rule when set to empty array', () => {
        const { result } = renderHook(() =>
          useQueryParamsState({
            initialFilter: { status: { equalAny: ['open', 'closed'] } },
          })
        );

        act(() =>
          result.current.filter.onChangeStringArrayFilterRule(
            'status',
            'equalAny',
            []
          )
        );

        expect(result.current.filter.filterBy).toEqual({});
      });

      it('sets new array filter rule', () => {
        const { result } = renderHook(() =>
          useQueryParamsState({
            initialFilter: { status: { equalAny: ['open', 'closed'] } },
          })
        );

        act(() =>
          result.current.filter.onChangeStringArrayFilterRule(
            'status',
            'equalAny',
            ['open', 'closed', 'draft']
          )
        );

        expect(result.current.filter.filterBy).toEqual({
          status: { equalAny: ['open', 'closed', 'draft'] },
        });
      });
    });

    describe('onChangeBooleanFilterRule', () => {
      it('sets boolean filter rule', () => {
        const { result } = renderHook(() =>
          useQueryParamsState({
            initialFilter: { isCool: { equalTo: false } },
          })
        );

        act(() =>
          result.current.filter.onChangeBooleanFilterRule(
            'isCool',
            'equalTo',
            true
          )
        );

        expect(result.current.filter.filterBy).toEqual({
          isCool: { equalTo: true },
        });
      });
    });

    describe('onChangeDateFilterRule', () => {
      it('sets before and after date rules when condition is between', () => {
        const { result } = renderHook(() => useQueryParamsState({}));

        act(() =>
          result.current.filter.onChangeDateFilterRule('holidays', 'between', [
            new Date('3/3/2023'),
            new Date('5/5/2023'),
          ])
        );

        expect(result.current.filter.filterBy).toEqual({
          holidays: {
            afterOrEqualTo: new Date('3/3/2023'),
            beforeOrEqualTo: new Date('5/5/2023'),
          },
        });
      });
      it('sets date filter rule', () => {
        const { result } = renderHook(() => useQueryParamsState({}));

        act(() =>
          result.current.filter.onChangeDateFilterRule(
            'birthday',
            'equalTo',
            new Date('1/1/2000')
          )
        );

        expect(result.current.filter.filterBy).toEqual({
          birthday: {
            equalTo: new Date('1/1/2000'),
          },
        });
      });
    });

    describe('onClearFilterRule', () => {
      it('clears one filter rule', () => {
        const { result } = renderHook(() =>
          useQueryParamsState({
            initialFilter: {
              id: { equalTo: 'some-id' },
              name: { like: 'spongebob' },
            },
          })
        );

        act(() => result.current.filter.onClearFilterRule('name'));

        expect(result.current.filter.filterBy).toEqual({
          id: { equalTo: 'some-id' },
        });
      });
    });
    describe('onClearFilterListRule', () => {
      it('clears many rules', () => {
        const { result } = renderHook(() =>
          useQueryParamsState({
            initialFilter: {
              id: { equalTo: 'some-id' },
              name: { like: 'spongebob' },
              itsPartyTime: { equalTo: true },
            },
          })
        );

        act(() => result.current.filter.onClearFilterListRule(['name', 'id']));

        expect(result.current.filter.filterBy).toEqual({
          itsPartyTime: { equalTo: true },
        });
      });
    });
  });
});

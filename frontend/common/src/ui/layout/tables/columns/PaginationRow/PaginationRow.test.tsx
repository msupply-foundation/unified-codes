import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { PaginationRow } from './PaginationRow';
import { createTableStore, TableProvider } from '../../context';
import { TestingProvider } from '../../../../../utils';

describe('PaginationRow', () => {
  it('Renders a string : Showing X-Y of Z', () => {
    const offset = 0;
    const first = 10;
    const total = 20;

    const { getByText } = render(
      <TestingProvider>
        <TableProvider createStore={createTableStore}>
          <PaginationRow
            page={0}
            offset={offset}
            total={total}
            first={first}
            onChange={jest.fn()}
          />
        </TableProvider>
      </TestingProvider>
    );

    const node1 = getByText(/showing/i);
    const node2 = getByText(`${offset + 1}-${first + offset}`);
    const node3 = getByText(/of/i);
    const node4 = getByText(`${total}`);

    expect(node1).toBeInTheDocument();
    expect(node2).toBeInTheDocument();
    expect(node3).toBeInTheDocument();
    expect(node4).toBeInTheDocument();
  });

  it('Renders at least one page button', () => {
    const { getByRole } = render(
      <TestingProvider>
        <TableProvider createStore={createTableStore}>
          <PaginationRow
            page={0}
            offset={1}
            total={1}
            first={1}
            onChange={jest.fn()}
          />
        </TableProvider>
      </TestingProvider>
    );

    const node = getByRole('button', { name: 'page 1' });

    expect(node).toBeInTheDocument();
  });

  it('Renders the first 5 pages and the last page', () => {
    const offset = 0;
    const first = 10;
    const total = 20000;

    const { queryByRole, getByRole } = render(
      <TestingProvider>
        <TableProvider createStore={createTableStore}>
          <PaginationRow
            page={0}
            offset={offset}
            total={total}
            first={first}
            onChange={jest.fn()}
          />
        </TableProvider>
      </TestingProvider>
    );

    const node1 = getByRole('button', { name: /page 1/i });
    const node2 = getByRole('button', { name: /page 2$/i });
    const node3 = getByRole('button', { name: /page 3/i });
    const node4 = getByRole('button', { name: /page 4/i });
    const node5 = getByRole('button', { name: /page 5/i });
    const node6 = queryByRole('button', { name: /page 6/i });
    const node2000 = getByRole('button', { name: /page 2000/i });

    expect(node1).toBeInTheDocument();
    expect(node2).toBeInTheDocument();
    expect(node3).toBeInTheDocument();
    expect(node4).toBeInTheDocument();
    expect(node5).toBeInTheDocument();
    expect(node6).not.toBeInTheDocument();
    expect(node2000).toBeInTheDocument();
  });

  it('Renders nothing when the total is zero', () => {
    const offset = 0;
    const first = 10;
    const total = 0;

    const { queryByRole, queryByText } = render(
      <TestingProvider>
        <TableProvider createStore={createTableStore}>
          <PaginationRow
            page={0}
            offset={offset}
            total={total}
            first={first}
            onChange={jest.fn()}
          />
        </TableProvider>
      </TestingProvider>
    );

    const node1 = queryByRole('button', { name: /page 1/i });
    const node2 = queryByText('showing');

    expect(node1).not.toBeInTheDocument();
    expect(node2).not.toBeInTheDocument();
  });

  it('Triggers the callback when a page button is pressed, with the page, zero indexed', () => {
    const offset = 0;
    const first = 10;
    const total = 20000;
    const onChange = jest.fn();

    const { getByRole } = render(
      <TestingProvider>
        <TableProvider createStore={createTableStore}>
          <PaginationRow
            page={0}
            offset={offset}
            total={total}
            first={first}
            onChange={onChange}
          />
        </TableProvider>
      </TestingProvider>
    );

    const node = getByRole('button', { name: /page 1/i });

    fireEvent.click(node);

    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(0);
  });

  it('has a disabled back button when on page 1', () => {
    const offset = 0;
    const first = 10;
    const total = 20000;
    const onChange = jest.fn();

    const { getByRole } = render(
      <TestingProvider>
        <TableProvider createStore={createTableStore}>
          <PaginationRow
            page={0}
            offset={offset}
            total={total}
            first={first}
            onChange={onChange}
          />
        </TableProvider>
      </TestingProvider>
    );

    const node = getByRole('button', { name: /prev/i });

    expect(node).toBeDisabled();
  });

  it('has an enabled next button when on page 1', () => {
    const offset = 0;
    const first = 10;
    const total = 20000;
    const onChange = jest.fn();

    const { getByRole } = render(
      <TestingProvider>
        <TableProvider createStore={createTableStore}>
          <PaginationRow
            page={0}
            offset={offset}
            total={total}
            first={first}
            onChange={onChange}
          />
        </TableProvider>
      </TestingProvider>
    );

    const node = getByRole('button', { name: /next/i });

    expect(node).toBeEnabled();
  });

  it('has both back and next buttons enabled when not on page 1', () => {
    const offset = 0;
    const first = 10;
    const total = 20000;
    const onChange = jest.fn();

    const { getByRole } = render(
      <TestingProvider>
        <TableProvider createStore={createTableStore}>
          <PaginationRow
            page={1}
            offset={offset}
            total={total}
            first={first}
            onChange={onChange}
          />
        </TableProvider>
      </TestingProvider>
    );

    const prev = getByRole('button', { name: /prev/i });
    const next = getByRole('button', { name: /next/i });

    expect(prev).toBeEnabled();
    expect(next).toBeEnabled();
  });
});

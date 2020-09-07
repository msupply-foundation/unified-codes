import { IPaginatable, IPaginatedResults, IPaginationParameters } from '@unified-codes/data';

export function getPaginatedResults<T extends IPaginatable>(
  params: IPaginationParameters<T>
): IPaginatedResults<T> {
  const { results } = params;
  const totalResults = results.length;
  const entities = paginateResults(params);
  const entityCount = entities.length;

  return {
    entities,
    cursor: entityCount ? results[entityCount - 1].cursor : null,
    // if the cursor at the end of the paginated results is the same as the
    // last item in _all_ results, then there are no more results after this
    hasMore: entityCount
      ? entities[entityCount - 1].cursor !== results[totalResults - 1].cursor
      : false,
    totalResults,
  };
}

function paginateResults<T extends IPaginatable>(params: IPaginationParameters<T>): Array<T> {
  const {
    after: cursor,
    pageSize = 20,
    results,
    // can pass in a function to calculate an item's cursor
    getCursor = () => null,
  } = params;

  if (pageSize < 1) return [];

  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex((item: T) => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    let itemCursor = item.cursor ? item.cursor : getCursor(item);

    // if there's still not a cursor, return false by default
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex >= 0
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(cursorIndex + 1, Math.min(results.length, cursorIndex + 1 + pageSize))
    : results.slice(0, pageSize);
}

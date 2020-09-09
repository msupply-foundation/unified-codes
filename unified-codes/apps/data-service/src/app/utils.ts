import { IPaginatedResults, IPaginationParameters } from '@unified-codes/data';

export function getPaginatedResults<T>(params: IPaginationParameters<T>): IPaginatedResults<T> {
  const { results } = params;
  const totalResults = results.length;
  const data = paginateResults(params);
  const entityCount = data.length;

  return {
    data,
    hasMore: totalResults > entityCount,
    totalResults,
  };
}

function paginateResults<T>(params: IPaginationParameters<T>): Array<T> {
  const { first, offset, results } = params;

  if (first < 1) return [];
  if (!offset) return results.slice(0, first);
  // don't let us overflow
  if (offset === results.length - 1) return [];

  return results.slice(offset, Math.min(results.length, offset + first));
}

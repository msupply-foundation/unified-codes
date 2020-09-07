import { IPaginatedResults, IPaginationParameters } from '@unified-codes/data';

export function getPaginatedResults<T>(params: IPaginationParameters<T>): IPaginatedResults<T> {
  const { results } = params;
  const totalResults = results.length;
  const entities = paginateResults(params);
  const entityCount = entities.length;

  return {
    entities,
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

  return results.slice(offset + 1, Math.min(results.length, offset + 1 + first));
}

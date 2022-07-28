import flatten from 'lodash/flatten'
import { ApiError } from '../errors/ApiError'

/**
 * Calculates the value of the "skip" parameter for the pages other the fist one.
 * @param {number} count The total of the items to fetch.
 * @param {number} pageSize The size of a single page.
 */
export const computeSkipValues = (count: number, pageSize: number): number[] => {
  let skip = pageSize
  let res = []
  while (skip < count) {
    res.push(skip)
    skip += pageSize
  }
  return res
}

/**
 * @typedef QSFetchFn
 * @param {string} qs Query string to inject into the path of the request.
 * @returns {Promise} The promise of the request.
 */

/**
 * Calls the specified fetch function multiple times,
 * in order to fetch all the items of a paginated request.
 * @param {QSFetchFn} fetchFn
 * @returns {Promise}
 *
 * @example
 * const fetcher = new ApiFetch(...)
 * const res = fetchAllPages(qs => fetcher.GET(`/myPaginatedApi?${qs}`))
 */
export const fetchAllPages = async <T_REQ, T_RES extends { count: number, items: any[] }>(
  fetchFn: (qsParams: string) => Promise<T_RES>,
) => {
  // Fetch the first page
  const page1: T_RES = await fetchFn(`skip=0`)

  // If the response is not a page throw an error
  if (!page1?.count || !page1?.items) throw new ApiError(400)

  // If the first page contains all the items, returns it
  if (page1.count === page1.items.length) return page1.items

  // otherwise, let's call all the order pages in parallel
  let skipValues = computeSkipValues(page1.count, page1.items.length)
  const otherPages: T_RES[] = await Promise
    .all(skipValues.map(skip => fetchFn(`skip=${skip}`)))
    .catch(() => {
      throw new ApiError(400)
    })

  // join all the pages into a single object and return it
  return page1.items.concat(...otherPages.map(page => page.items))
}

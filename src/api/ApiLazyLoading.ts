/**
 * An utility to compose query-strings for API lazy-loading.
 */
export class ApiLazyLoading {
  skip: number = 0
  limit: number

  constructor(limit: number = 0) {
    this.limit = limit
  }

  setLimit(limit: number) {
    this.limit = limit
  }

  skipMore(count: number) {
    this.skip += count
  }

  toString(): string {
    return `skip=${this.skip}&limit=${this.limit}`
  }
}

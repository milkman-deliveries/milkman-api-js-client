/**
 * An utility to compose query-strings for API pagination.
 */
export class ApiPagination {
  pageIndex: number = 0
  pageSize: number

  constructor(pageSize: number) {
    this.pageSize = pageSize
  }

  setPage(pageIndex: number) {
    this.pageIndex = pageIndex
  }

  /**
   * Compose the value from the "query string" parameter.
   */
  toString(): string {
    const skip = this.pageIndex > 0 ? (this.pageIndex - 1) * this.pageSize : 0
    return `skip=${skip}&limit=${this.pageSize}`
  }
}

/**
 * An utility to compose query-strings for API pagination.
 */
export class ApiPagination {
  pageSize: number

  constructor(pageSize: number) {
    this.pageSize = pageSize
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize
  }

  page(pageIndex: number): string {
    const skip = pageIndex > 0 ? pageIndex * this.pageSize : 0
    return `skip=${skip}&limit=${this.pageSize}`
  }
}

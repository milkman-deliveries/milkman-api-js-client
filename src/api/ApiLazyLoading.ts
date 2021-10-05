/**
 * An utility to compose query-strings for API lazy-loading.
 */
export class ApiLazyLoading {
  skip: number = 0

  reset() {
    this.skip = 0
  }

  load(limit: number) {
    const qs = `skip=${this.skip}&limit=${limit}`
    this.skip += limit
    return qs
  }
}

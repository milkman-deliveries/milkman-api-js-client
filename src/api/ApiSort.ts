export enum ApiSortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export interface ApiSortRule {
  name: string
  direction: ApiSortDirection
}

/**
 * An utility to compose query-strings for sorting APIs.
 */
export class ApiSort {
  rules: ApiSortRule[] = []

  /**
   * Add or update a rule to the sorting.
   */
  private addRule(name: string, direction: ApiSortDirection = ApiSortDirection.ASC): ApiSort {
    this.rules.push({name, direction})
    return this
  }

  /**
   * Add an "ascending" rule from the sorting.
   */
  asc(name: string): ApiSort {
    return this.addRule(name, ApiSortDirection.ASC)
  }

  /**
   * Add a "descending" rule from the sorting.
   */
  desc(name: string): ApiSort {
    return this.addRule(name, ApiSortDirection.DESC)
  }

  /**
   * Compose the value from the "query string" parameter.
   */
  toString(): string {
    const sort = this.rules
      .map(rule => `${rule.name}(${rule.direction})`)
      .join(',')
    return `sort=${sort}`
  }
}

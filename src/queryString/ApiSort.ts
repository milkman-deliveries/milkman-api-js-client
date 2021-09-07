export enum ApiSortValue {
  ASC = 1,
  DESC = 0
}

/**
 * An utility to compose a "sort" parameter.
 */
export class ApiSort {
  sort: { [ruleType: string]: ApiSortValue } = {}

  /**
   * Add or update a rule to the sorting.
   */
  private addRule(ruleName: string, ruleValue: ApiSortValue = ApiSortValue.ASC): ApiSort {
    this.sort[ruleName] = ruleValue
    return this
  }

  /**
   * Delete a rule from the sorting.
   */
  removeRule(ruleName: string): ApiSort {
    delete this.sort[ruleName]
    return this
  }

  /**
   * Add an "ascending" rule from the sorting.
   */
  asc(ruleName: string): ApiSort {
    return this.addRule(ruleName, ApiSortValue.ASC)
  }

  /**
   * Add a "descending" rule from the sorting.
   */
  desc(ruleName: string): ApiSort {
    return this.addRule(ruleName, ApiSortValue.DESC)
  }

  /**
   * Compose the value from the "query string" parameter.
   */
  toString(): string {
    return JSON.stringify(this.sort)
  }
}

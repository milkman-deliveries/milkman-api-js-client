export enum ApiSortValue {
  ASC = 1,
  DESC = 0
}

/**
 * An utility to compose a "sort" parameter.
 */
export class LegacyApiSort {
  sort: { [ruleType: string]: ApiSortValue } = {}

  /**
   * Add or update a rule to the sorting.
   */
  private addRule(ruleName: string, ruleValue: ApiSortValue = ApiSortValue.ASC): LegacyApiSort {
    this.sort[ruleName] = ruleValue
    return this
  }

  /**
   * Delete a rule from the sorting.
   */
  removeRule(ruleName: string): LegacyApiSort {
    delete this.sort[ruleName]
    return this
  }

  /**
   * Add an "ascending" rule from the sorting.
   */
  asc(ruleName: string): LegacyApiSort {
    return this.addRule(ruleName, ApiSortValue.ASC)
  }

  /**
   * Add a "descending" rule from the sorting.
   */
  desc(ruleName: string): LegacyApiSort {
    return this.addRule(ruleName, ApiSortValue.DESC)
  }

  /**
   * Compose the value from the "query string" parameter.
   */
  toString(): string {
    return `sort=${JSON.stringify(this.sort)}`
  }
}

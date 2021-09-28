export enum ApiFilterOperator {
  EQ = 'eq',
  NE = 'ne',
  GT = 'gt',
  GE = 'ge',
  LT = 'lt',
  LE = 'le',
  IN = 'in',
}

/**
 * An utility to compose query-strings for filtering APIs.
 */
export class ApiFilter {
  filters: { [filterName: string]: any } = {}

  composeFilterName(field: string, operator: ApiFilterOperator = ApiFilterOperator.EQ): string {
    if (operator === ApiFilterOperator.EQ) return field
    return `${field}[${operator}]`
  }

  /**
   * Add or update a rule.
   */
  addRule(field: string, operator: ApiFilterOperator, value: any = ''): ApiFilter {
    const filterName = this.composeFilterName(field, operator)
    const filterValue = typeof value === 'object' ? JSON.stringify(value) : value
    this.filters[filterName] = filterValue
    return this
  }

  /**
   * Remove a rule.
   */
  removeRule(field: string, operator: ApiFilterOperator): ApiFilter {
    const rule = this.composeFilterName(field, operator)
    if (this.filters.hasOwnProperty(rule)) {
      delete this.filters[rule]
    }
    return this
  }

  /**
   * Add a rule of type "equals".
   */
  eq(field: string, value: any): ApiFilter {
    return this.addRule(field, ApiFilterOperator.EQ, value)
  }

  /**
   * Add a rule of type "not equals".
   */
  ne(field: string, value: any): ApiFilter {
    return this.addRule(field, ApiFilterOperator.NE, value)
  }

  /**
   * Add a rule of type "greater than".
   */
  gt(field: string, value: any): ApiFilter {
    return this.addRule(field, ApiFilterOperator.GT, value)
  }

  /**
   * Add a rule of type "greater than or equal".
   */
  ge(field: string, value: any): ApiFilter {
    return this.addRule(field, ApiFilterOperator.GE, value)
  }

  /**
   * Add a rule of type "less than".
   */
  lt(field: string, value: any): ApiFilter {
    return this.addRule(field, ApiFilterOperator.LT, value)
  }

  /**
   * Add a rule of type "less than or equal".
   */
  le(field: string, value: any): ApiFilter {
    return this.addRule(field, ApiFilterOperator.LE, value)
  }

  /**
   * Add a rule of type "in".
   */
  in(field: string, value: any[]): ApiFilter {
    return this.addRule(field, ApiFilterOperator.IN, value.join(','))
  }

  /**
   * Stringify the filters as a query-string.
   */
  toString(): string {
    return Object.keys(this.filters)
      .map(rule => `${rule}=${this.filters[rule]}`)
      .join('&')
  }
}

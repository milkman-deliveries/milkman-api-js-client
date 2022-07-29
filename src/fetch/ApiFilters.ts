import isFunction from 'lodash/isFunction'

export enum ApiFilterOperator {
  EQ = '',
  NE = 'ne',
  GT = 'gt',
  GE = 'ge',
  LT = 'lt',
  LE = 'le',
  IN = 'in',
}

export interface ApiFilterRule {
  operator: ApiFilterOperator
  value: string
}

export interface ApiFilter {
  field: string
  rules: Map<ApiFilterOperator, ApiFilterRule>
}

/**
 * Utility to compose query-strings for filtering APIs.
 */
export class ApiFilters {

  __isReserved(filterName: string): boolean {
    return this[filterName] && isFunction(this[filterName])
  }

  __composeFilterName(field: string, operator: string = ''): string {
    if (operator === '') return field
    return `${field}(${operator})`
  }

  /**
   * Add or update a rule.
   */
  addFilter(field: string, operator: string = '', value: any = ''): ApiFilters {
    if (field) {
      const filterName = this.__composeFilterName(field, operator)
      if (!this.__isReserved(filterName)) {
        this[filterName] = value
      }
    }
    return this
  }

  /**
   * Remove a rule.
   */
  removeFilter(field: string, operator: ApiFilterOperator | '' = ''): ApiFilters {
    if (field) {
      const filterName = this.__composeFilterName(field, operator)
      if (!this.__isReserved(filterName)) {
        delete this[filterName]
      }
    }
    return this
  }

  /**
   * Add a rule of type "equals".
   */
  eq(field: string, value: any): ApiFilters {
    return this.addFilter(field, ApiFilterOperator.EQ, value)
  }

  /**
   * Add a rule of type "not equals".
   */
  ne(field: string, value: any): ApiFilters {
    return this.addFilter(field, ApiFilterOperator.NE, value)
  }

  /**
   * Add a rule of type "greater than".
   */
  gt(field: string, value: any): ApiFilters {
    return this.addFilter(field, ApiFilterOperator.GT, value)
  }

  /**
   * Add a rule of type "greater than or equal".
   */
  ge(field: string, value: any): ApiFilters {
    return this.addFilter(field, ApiFilterOperator.GE, value)
  }

  /**
   * Add a rule of type "less than".
   */
  lt(field: string, value: any): ApiFilters {
    return this.addFilter(field, ApiFilterOperator.LT, value)
  }

  /**
   * Add a rule of type "less than or equal".
   */
  le(field: string, value: any): ApiFilters {
    return this.addFilter(field, ApiFilterOperator.LE, value)
  }

  /**
   * Add a rule of type "in".
   */
  in(field: string, values: any[]): ApiFilters {
    return this.addFilter(field, ApiFilterOperator.IN, values)
  }
}

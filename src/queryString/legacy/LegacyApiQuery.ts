export enum ApiQueryRuleType {
  EQ = '$eq',
  NE = '$ne',
  GT = '$gt',
  GTE = '$gte',
  LT = '$le',
  LTE = '$lte',
  IN = '$in',
}

/**
 * An utility to compose a "query" parameter using Milkman "query language".
 */
export class LegacyApiQuery {
  query: { [ruleType: string]: any } = {}

  /**
   * Add or update a rule to the query.
   */
  addRule(field: string, ruleType: string, value: any = ''): LegacyApiQuery {
    if (!this.query.hasOwnProperty(field)) {
      this.query[field] = {}
    }
    this.query[field][ruleType] = value
    return this
  }

  /**
   * Remove a rule from the query.
   */
  removeRule(field: string, ruleType: string): LegacyApiQuery {
    if (this.query.hasOwnProperty(field) && this.query[field].hasOwnProperty(ruleType)) {
      delete this.query[field][ruleType]
      if (Object.keys(this.query[field]).length === 0) {
        delete this.query[field]
      }
    }
    return this
  }

  /**
   * Add a rule of type "equals".
   */
  eq(field: string, value: any): LegacyApiQuery {
    return this.addRule(field, ApiQueryRuleType.EQ, value)
  }

  /**
   * Add a rule of type "not equals".
   */
  ne(field: string, value: any): LegacyApiQuery {
    return this.addRule(field, ApiQueryRuleType.NE, value)
  }

  /**
   * Add a rule of type "greater than".
   */
  gt(field: string, value: any): LegacyApiQuery {
    return this.addRule(field, ApiQueryRuleType.GT, value)
  }

  /**
   * Add a rule of type "greater than or equal".
   */
  gte(field: string, value: any): LegacyApiQuery {
    return this.addRule(field, ApiQueryRuleType.GTE, value)
  }

  /**
   * Add a rule of type "less than".
   */
  lt(field: string, value: any): LegacyApiQuery {
    return this.addRule(field, ApiQueryRuleType.LT, value)
  }

  /**
   * Add a rule of type "less than or equal".
   */
  lte(field: string, value: any): LegacyApiQuery {
    return this.addRule(field, ApiQueryRuleType.LTE, value)
  }

  /**
   * Add a rule of type "in".
   */
  in(field: string, value: any[]): LegacyApiQuery {
    return this.addRule(field, ApiQueryRuleType.IN, value)
  }

  /**
   * Compose the value from the "query string" parameter.
   */
  toString(): string {
    return `query=${JSON.stringify(this.query)}`
  }
}

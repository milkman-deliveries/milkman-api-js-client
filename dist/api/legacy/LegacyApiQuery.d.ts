export declare enum ApiQueryRuleType {
    EQ = "$eq",
    NE = "$ne",
    GT = "$gt",
    GTE = "$gte",
    LT = "$lt",
    LTE = "$lte",
    IN = "$in"
}
/**
 * An utility to compose a "query" parameter using Milkman "query language".
 */
export declare class LegacyApiQuery {
    query: {
        [ruleType: string]: any;
    };
    /**
     * Add or update a rule to the query.
     */
    addRule(field: string, ruleType: string, value?: any): LegacyApiQuery;
    /**
     * Remove a rule from the query.
     */
    removeRule(field: string, ruleType: string): LegacyApiQuery;
    /**
     * Add a rule of type "equals".
     */
    eq(field: string, value: any): LegacyApiQuery;
    /**
     * Add a rule of type "not equals".
     */
    ne(field: string, value: any): LegacyApiQuery;
    /**
     * Add a rule of type "greater than".
     */
    gt(field: string, value: any): LegacyApiQuery;
    /**
     * Add a rule of type "greater than or equal".
     */
    gte(field: string, value: any): LegacyApiQuery;
    /**
     * Add a rule of type "less than".
     */
    lt(field: string, value: any): LegacyApiQuery;
    /**
     * Add a rule of type "less than or equal".
     */
    lte(field: string, value: any): LegacyApiQuery;
    /**
     * Add a rule of type "in".
     */
    in(field: string, value: any[]): LegacyApiQuery;
    /**
     * Compose the value from the "query string" parameter.
     */
    toString(): string;
}

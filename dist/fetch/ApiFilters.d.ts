export declare enum ApiFilterOperator {
    EQ = "",
    NE = "ne",
    GT = "gt",
    GE = "ge",
    LT = "lt",
    LE = "le",
    IN = "in"
}
export interface ApiFilterRule {
    operator: ApiFilterOperator;
    value: string;
}
export interface ApiFilter {
    field: string;
    rules: Map<ApiFilterOperator, ApiFilterRule>;
}
/**
 * An utility to compose query-strings for filtering APIs.
 */
export declare class ApiFilters {
    __isReserved(filterName: string): boolean;
    __composeFilterName(field: string, operator?: string): string;
    /**
     * Add or update a rule.
     */
    addFilter(field: string, operator?: string, value?: any): ApiFilters;
    /**
     * Remove a rule.
     */
    removeFilter(field: string, operator?: ApiFilterOperator | ''): ApiFilters;
    /**
     * Add a rule of type "equals".
     */
    eq(field: string, value: any): ApiFilters;
    /**
     * Add a rule of type "not equals".
     */
    ne(field: string, value: any): ApiFilters;
    /**
     * Add a rule of type "greater than".
     */
    gt(field: string, value: any): ApiFilters;
    /**
     * Add a rule of type "greater than or equal".
     */
    ge(field: string, value: any): ApiFilters;
    /**
     * Add a rule of type "less than".
     */
    lt(field: string, value: any): ApiFilters;
    /**
     * Add a rule of type "less than or equal".
     */
    le(field: string, value: any): ApiFilters;
    /**
     * Add a rule of type "in".
     */
    in(field: string, values: any[]): ApiFilters;
}

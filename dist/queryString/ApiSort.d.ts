export declare enum ApiSortValue {
    ASC = 1,
    DESC = 0
}
/**
 * An utility to compose a "sort" parameter.
 */
declare class ApiSort {
    sort: {
        [ruleType: string]: ApiSortValue;
    };
    /**
     * Add or update a rule to the sorting.
     */
    private addRule;
    /**
     * Delete a rule from the sorting.
     */
    removeRule(ruleName: string): ApiSort;
    /**
     * Add an "ascending" rule from the sorting.
     */
    asc(ruleName: string): ApiSort;
    /**
     * Add a "descending" rule from the sorting.
     */
    desc(ruleName: string): ApiSort;
    /**
     * Compose the value from the "query string" parameter.
     */
    toString(): string;
}
export default ApiSort;

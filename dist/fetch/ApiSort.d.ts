export declare enum ApiSortDirection {
    ASC = "asc",
    DESC = "desc"
}
export interface ApiSortRule {
    name: string;
    direction: ApiSortDirection;
}
/**
 * An utility to compose query-strings for sorting APIs.
 */
export declare class ApiSort {
    rules: ApiSortRule[];
    /**
     * Add or update a rule to the sorting.
     */
    private addRule;
    /**
     * Add an "ascending" rule from the sorting.
     */
    asc(name: string): ApiSort;
    /**
     * Add a "descending" rule from the sorting.
     */
    desc(name: string): ApiSort;
    /**
     * Compose the value from the "query string" parameter.
     */
    toString(): string;
}

/**
 * An utility to compose query-strings for API lazy-loading.
 */
export declare class ApiLazyLoading {
    skip: number;
    limit: number;
    constructor(limit?: number);
    setLimit(limit: number): void;
    skipMore(count: number): void;
    toString(): string;
}

/**
 * An utility to compose query-strings for API lazy-loading.
 */
export declare class ApiLazyLoading {
    skip: number;
    reset(): void;
    load(limit: number): string;
}

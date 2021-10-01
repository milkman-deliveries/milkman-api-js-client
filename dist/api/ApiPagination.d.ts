/**
 * An utility to compose query-strings for API pagination.
 */
export declare class ApiPagination {
    pageSize: number;
    constructor(pageSize: number);
    setPageSize(pageSize: number): void;
    page(pageIndex: number): string;
}

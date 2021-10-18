export declare const apiErrorItemTypeRegex: RegExp;
export declare class ApiErrorItem {
    type: string;
    text?: string;
    field?: string;
    value?: any;
    category?: string;
    reason?: string;
    constructor(item: any);
}
export declare class ApiError extends Error {
    status: number;
    items: ApiErrorItem[];
    constructor(status: number, errors?: ApiErrorItem[]);
}

export declare class LegacyApiErrorItem {
    code: number;
    text?: string;
    field?: string;
    value?: any;
    constructor(item: any);
}
export declare class LegacyApiError extends Error {
    status: number;
    items: LegacyApiErrorItem[];
    constructor(status: number, errors?: LegacyApiErrorItem[]);
}

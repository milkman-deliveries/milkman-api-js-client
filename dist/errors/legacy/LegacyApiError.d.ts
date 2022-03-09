import { LegacyApiResponseError } from '../../types/LegacyApiResponseData';
export declare class LegacyApiError extends Error {
    status: number;
    items: LegacyApiResponseError[];
    constructor(status: number, errors?: LegacyApiResponseError[]);
}

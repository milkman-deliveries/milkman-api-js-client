import { LegacyApiResponseError } from '../../fetch/types/LegacyApiResponseData';
export declare class LegacyApiError extends Error {
    status: number;
    items: LegacyApiResponseError[];
    constructor(status: number, errors?: LegacyApiResponseError[]);
}

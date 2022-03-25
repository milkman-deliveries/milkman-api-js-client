export interface LegacyApiResponseError {
    code: string;
    message?: string;
}
export interface LegacyApiResponseResult {
    success: boolean;
    session?: string;
    errors?: LegacyApiResponseError[];
    count?: number;
    entities?: object[];
}
export interface LegacyApiResponseData {
    result: LegacyApiResponseResult;
}

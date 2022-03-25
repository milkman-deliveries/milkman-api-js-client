import { ApiResponseError } from './ApiResponseError';
export interface ApiResponseData {
    errors?: ApiResponseError[];
    count?: number;
    items?: object[];
}

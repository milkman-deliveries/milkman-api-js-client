import { ApiFetchRequestInfo } from './ApiFetchRequestInfo';
export interface ApiFetchResponseInfo<T_REQ, T_RES> extends ApiFetchRequestInfo<T_REQ> {
    /** HTTP response */
    response: Response;
    /** HTTP Response body data */
    responseData?: T_RES;
}

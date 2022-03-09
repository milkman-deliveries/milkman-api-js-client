import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import 'isomorphic-fetch';
import { ApiRequestInfo } from '../types/ApiRequestInfo';
import { ApiResponseInfo } from '../types/ApiResponseInfo';
import { RequestEnhancer } from '../types/RequestEnhancer';
import { ResponseHandler } from '../types/ResponseHandler';
export interface ApiFetchConfig {
    /** Base url for every API call. Default is "/". */
    baseUrl?: string;
    /** List of request enhancers. */
    requestEnhancers?: RequestEnhancer<any, any>[];
    /** List of response handlers. */
    responseHandlers?: ResponseHandler<any, any, any>[];
}
export declare class ApiFetch {
    baseUrl: string;
    requestEnhancers?: RequestEnhancer<any, any>[];
    responseHandlers?: ResponseHandler<any, any, any>[];
    constructor(config?: ApiFetchConfig);
    composeUrl(path: string): string;
    enhanceRequestInfo<T_INITIAL_REQ, T_ENHANCED_REQ>(requestInfo: ApiRequestInfo<T_INITIAL_REQ>): Promise<ApiRequestInfo<T_ENHANCED_REQ>>;
    applyResponseHandlers<T_REQ, T_INITIAL_RES, T_HANDLED_RES>(requestInfo: ApiRequestInfo<T_REQ>, responseInfo: ApiResponseInfo<T_INITIAL_RES>): Promise<ApiResponseInfo<T_HANDLED_RES>>;
    composeRequest<T>(info: ApiRequestInfo<T>, signal: AbortSignal): Promise<RequestInit>;
    fetch<T_REQ, T_RES>(requestInfo: ApiRequestInfo<T_REQ>): Promise<T_RES>;
    GET<T_REQ, T_RES>(path: string, options?: any, meta?: object): Promise<T_RES>;
    POST<T_REQ, T_RES>(path: string, data: T_REQ, options?: any, meta?: object): Promise<T_RES>;
    PUT<T_REQ, T_RES>(path: string, data: T_REQ, options?: any, meta?: object): Promise<T_RES>;
    PATCH<T_REQ, T_RES>(path: string, data: T_REQ, options?: any, meta?: object): Promise<T_RES>;
    DELETE<T_REQ, T_RES>(path: string, options?: any, meta?: object): Promise<T_RES>;
}

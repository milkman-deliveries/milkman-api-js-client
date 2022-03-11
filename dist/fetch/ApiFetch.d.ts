import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import 'isomorphic-fetch';
import { ApiFetchRequestInfo } from './types/ApiFetchRequestInfo';
import { ApiFetchResponseInfo } from './types/ApiFetchResponseInfo';
import { RequestEnhancer } from './types/RequestEnhancer';
import { ResponseHandler } from './types/ResponseHandler';
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
    enhanceRequestInfo<T_INITIAL_REQ, T_ENHANCED_REQ>(requestInfo: ApiFetchRequestInfo<T_INITIAL_REQ>): Promise<ApiFetchRequestInfo<T_ENHANCED_REQ>>;
    applyResponseHandlers<T_REQ, T_INITIAL_RES, T_HANDLED_RES>(responseInfo: ApiFetchResponseInfo<T_REQ, T_INITIAL_RES>): Promise<ApiFetchResponseInfo<T_REQ, T_HANDLED_RES>>;
    composeRequest<T_REQ>(info: ApiFetchRequestInfo<T_REQ>, signal: AbortSignal): RequestInit;
    _prefetch<T_REQ>(requestInfo: ApiFetchRequestInfo<T_REQ>, controller: AbortController): Promise<ApiFetchRequestInfo<any>>;
    _fetch(requestInfo: ApiFetchRequestInfo<any>, controller: AbortController): Promise<ApiFetchResponseInfo<any, Response>>;
    _postfetch<T_REQ, T_RES>(responseInfo: ApiFetchResponseInfo<T_REQ, Response>, controller: AbortController): Promise<ApiFetchResponseInfo<T_REQ, T_RES>>;
    fetch<T_REQ, T_RES>(requestInfo: ApiFetchRequestInfo<T_REQ>): Promise<T_RES>;
    GET<T_REQ, T_RES>(path: string, options?: any, meta?: object): Promise<T_RES>;
    POST<T_REQ, T_RES>(path: string, requestData: T_REQ, options?: any, meta?: object): Promise<T_RES>;
    PUT<T_REQ, T_RES>(path: string, requestData: T_REQ, options?: any, meta?: object): Promise<T_RES>;
    PATCH<T_REQ, T_RES>(path: string, requestData: T_REQ, options?: any, meta?: object): Promise<T_RES>;
    DELETE<T_REQ, T_RES>(path: string, options?: any, meta?: object): Promise<T_RES>;
}

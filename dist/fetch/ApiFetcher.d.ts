import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import 'isomorphic-fetch';
import { ApiFetchRequestInfo } from './types/ApiFetchRequestInfo';
import { RequestEnhancer } from './types/RequestEnhancer';
import { ResponseHandler } from './types/ResponseHandler';
export interface ApiFetcherConfig {
    /** Base url for every API call. Default is "/". */
    baseUrl?: string;
    /** List of request enhancers. */
    requestEnhancers?: RequestEnhancer<any, any>[];
    /** List of response handlers. */
    responseHandlers?: ResponseHandler<any, any, any>[];
}
export declare class ApiFetcher {
    config: ApiFetcherConfig;
    constructor(config?: ApiFetcherConfig);
    fetch<T_REQ, T_RES>(info: ApiFetchRequestInfo<T_REQ>): Promise<T_RES>;
    GET<T_REQ, T_RES>(path: string, options?: Partial<RequestInit>): Promise<T_RES>;
    POST<T_REQ, T_RES>(path: string, data: T_REQ, options?: Partial<RequestInit>): Promise<T_RES>;
    PUT<T_REQ, T_RES>(path: string, data: T_REQ, options?: Partial<RequestInit>): Promise<T_RES>;
    PATCH<T_REQ, T_RES>(path: string, data: T_REQ, options?: Partial<RequestInit>): Promise<T_RES>;
    DELETE<T_REQ, T_RES>(path: string, options?: Partial<RequestInit>): Promise<T_RES>;
}

import 'isomorphic-fetch';
import { ApiFetchInfo } from '../types/ApiFetchInfo';
import { RequestEnhancer } from '../types/RequestEnhancer';
import { ResponseHandler } from '../types/ResponseHandler';
export interface ApiConfig {
    /** Base url for every API call. Default is "/". */
    baseUrl?: string;
    /** List of request enhancers. */
    requestEnhancers?: RequestEnhancer<any>[];
    /** List of response handlers. */
    responseHandlers?: ResponseHandler<any, any, any>[];
}
export declare class ApiFetch {
    baseUrl: string;
    requestEnhancers?: RequestEnhancer<any>[];
    responseHandlers?: ResponseHandler<any, any, any>[];
    constructor(config?: ApiConfig);
    composeUrl(path: string): string;
    applyRequestEnhancers<T>(request: RequestInit, info: ApiFetchInfo<T>): Promise<RequestInit>;
    applyResponseHandlers<T>(request: RequestInit, response: Response, info: ApiFetchInfo<T>): Promise<any>;
    composeRequest<T>(info: ApiFetchInfo<T>, signal: AbortSignal): Promise<RequestInit>;
    fetch<T>(info: ApiFetchInfo<T>): Promise<Response>;
    GET<T>(path: string, options?: any, meta?: object): Promise<Response>;
    POST<T>(path: string, data: any, options?: any, meta?: object): Promise<Response>;
    PUT<T>(path: string, data: T, options?: any, meta?: object): Promise<Response>;
    PATCH<T>(path: string, data: any, options?: any, meta?: object): Promise<Response>;
    DELETE<T>(path: string, options?: any, meta?: object): Promise<Response>;
}

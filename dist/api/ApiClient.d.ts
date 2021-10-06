import 'isomorphic-fetch';
import { ApiFetchInfo } from '../types/ApiFetchInfo';
import { RequestEnhancer } from '../types/RequestEnhancer';
import { ResponseHandler } from '../types/ResponseHandler';
export interface ApiConfig {
    /** Base url for every API call. Default is "/". */
    baseUrl?: string;
    /** List of request enhancers. */
    requestEnhancers?: RequestEnhancer[];
    /** List of response handlers. */
    responseHandlers?: ResponseHandler[];
}
export declare class ApiClient {
    baseUrl: string;
    requestEnhancers?: RequestEnhancer[];
    responseHandlers?: ResponseHandler[];
    constructor(config?: ApiConfig);
    composeUrl(path: string): string;
    applyRequestEnhancers<T>(request: RequestInit, info: ApiFetchInfo<T>): Promise<RequestInit>;
    applyResponseHandlers<T>(request: RequestInit, response: Response, info: ApiFetchInfo<T>): Promise<Response>;
    composeRequest<T>(info: ApiFetchInfo<T>): Promise<RequestInit>;
    fetch<T>(info: ApiFetchInfo<T>): Promise<Response>;
    GET<T>(path: string, options?: any): Promise<Response>;
    POST<T>(path: string, data: any, options?: any): Promise<Response>;
    PUT<T>(path: string, data: T, options?: any): Promise<Response>;
    PATCH<T>(path: string, data: any, options?: any): Promise<Response>;
    DELETE<T>(path: string, options?: any): Promise<Response>;
}

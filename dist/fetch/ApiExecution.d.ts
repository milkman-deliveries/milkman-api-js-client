import { ApiFetcherConfig } from './ApiFetcher';
import { ApiFetchRequestInfo } from './types/ApiFetchRequestInfo';
import { ApiFetchResponseInfo } from './types/ApiFetchResponseInfo';
import { RequestEnhancer } from './types/RequestEnhancer';
import { ResponseHandler } from './types/ResponseHandler';
export declare class ApiExecution<T_REQ, T_RES> implements ApiFetcherConfig {
    baseUrl: string;
    requestEnhancers?: RequestEnhancer<any, any>[];
    responseHandlers?: ResponseHandler<any, any, any>[];
    originalRequestInfo: ApiFetchRequestInfo<T_REQ>;
    controller: AbortController;
    _abort: boolean;
    _retry: boolean;
    meta: object;
    constructor(requestInfo: ApiFetchRequestInfo<T_REQ>, fetcherConfig: ApiFetcherConfig);
    restore(): void;
    stop(): void;
    retry(): void;
    composeUrl(path: string): string;
    composeRequest(requestInfo: ApiFetchRequestInfo<T_REQ>): RequestInit;
    applyRequestEnhancers(requestInfo: ApiFetchRequestInfo<T_REQ>): Promise<ApiFetchRequestInfo<unknown>>;
    applyResponseHandlers(requestInfo: ApiFetchRequestInfo<unknown>, responseInfo: ApiFetchResponseInfo<Response>): Promise<ApiFetchResponseInfo<unknown>>;
    fetch(requestInfo: ApiFetchRequestInfo<any>): Promise<ApiFetchResponseInfo<Response>>;
    _execStep<T>(func: () => Promise<T>): Promise<T>;
    exec(): Promise<T_RES>;
}

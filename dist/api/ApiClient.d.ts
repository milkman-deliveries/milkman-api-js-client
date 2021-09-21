import 'isomorphic-fetch';
import { RequestEnhancer } from "./RequestEnhancer";
export interface ApiConfig {
    /** Base url for every API call. Default is "/". */
    baseUrl?: string;
    /** List of enhancers for API requests. */
    enhancers?: RequestEnhancer[];
}
export declare const defaultHeaders: {
    Accept: string;
    'Content-Type': string;
};
export declare class ApiClient {
    baseUrl: string;
    enhancers: RequestEnhancer[];
    constructor(config?: ApiConfig);
    composeUrl(url: string): string;
    composeRequest(method: any, customOptions?: RequestInit): RequestInit;
    fetch(method: string, url: string, options?: any): Promise<Response>;
    get(url: string, options?: any): Promise<Response>;
    post(url: string, data: any, options?: any): Promise<Response>;
    put(url: string, data: any, options?: any): Promise<Response>;
    patch(url: string, data: any, options?: any): Promise<Response>;
    delete(url: string, options?: any): Promise<Response>;
}

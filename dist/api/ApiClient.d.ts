import 'isomorphic-fetch';
import { RequestEnhancer } from './RequestEnhancer';
export interface ApiConfig {
    /** Base url for every API call. Default is "/". */
    baseUrl?: string;
    /** List of enhancers for API requests. */
    enhancers?: RequestEnhancer[];
}
export declare class ApiClient {
    baseUrl: string;
    enhancers: RequestEnhancer[];
    constructor(config?: ApiConfig);
    composeUrl(url: string): string;
    composeRequest(method: any, customOptions?: RequestInit): RequestInit;
    fetch(method: string, url: string, options?: any): Promise<Response>;
    GET(url: string, options?: any): Promise<Response>;
    POST(url: string, data: any, options?: any): Promise<Response>;
    PUT(url: string, data: any, options?: any): Promise<Response>;
    PATCH(url: string, data: any, options?: any): Promise<Response>;
    DELETE(url: string, options?: any): Promise<Response>;
}

import 'isomorphic-fetch';
export declare type ApiHeader = {
    [key: string]: string;
};
export declare type ApiOptions = {
    [key: string]: any;
};
export interface ApiConfig {
    /** Base url for every API call. Default is "/". */
    baseUrl?: string;
}
export declare const defaultHeaders: {
    Accept: string;
    'Content-Type': string;
};
export declare class ApiClient {
    baseUrl?: string;
    constructor(config?: ApiConfig);
    composeUrl(url: string): string;
    composeHeaders(customHeaders?: ApiHeader): ApiHeader;
    composeOptions(method: any, customOptions?: ApiOptions): ApiOptions;
    fetch(method: string, url: string, options?: any): Promise<Response>;
    get(url: string, options?: any): void;
    post(url: string, data: any, options?: any): void;
    put(url: string, data: any, options?: any): void;
    patch(url: string, data: any, options?: any): void;
    delete(url: string, options?: any): void;
}

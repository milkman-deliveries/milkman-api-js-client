export declare class ApiRequestInfo<T_REQ> {
    /** HTTP Request path */
    path: string;
    /** HTTP Request method */
    method: string;
    /** HTTP Request body data */
    data?: T_REQ | undefined;
    /** HTTP Request options. */
    options: Partial<RequestInit>;
    /** Additional data used for requests management. */
    meta: object;
    constructor(path: string, method: string, data?: T_REQ, options?: any, meta?: object);
}

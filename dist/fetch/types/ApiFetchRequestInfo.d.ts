export interface ApiFetchRequestInfo<T_REQ> {
    /** Additional support information */
    meta: object;
    /** HTTP Request path */
    path: string;
    /** HTTP Request method */
    method: string;
    /** HTTP Request */
    request?: RequestInit;
    /** HTTP Request body data */
    requestData?: T_REQ;
    /** HTTP Request options */
    options: Partial<RequestInit>;
}

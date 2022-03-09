export interface ApiRequestInfo<T_REQ> {
  /** HTTP Request path */
  path: string
  /** HTTP Request method */
  method: string,
  /** HTTP Request body data */
  data?: T_REQ
  /** HTTP Request options. */
  options?: Partial<RequestInit>,
  /** Additional data used for requests management. */
  meta?: object
}

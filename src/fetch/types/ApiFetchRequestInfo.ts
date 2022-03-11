export interface ApiFetchRequestInfo<T_REQ> {
  /** HTTP Request path */
  path: string
  /** HTTP Request method */
  method: string
  /** HTTP Request */
  request?: RequestInit
  /** HTTP Request body data */
  data?: T_REQ
  /** HTTP Request options */
  options: Partial<RequestInit>
}

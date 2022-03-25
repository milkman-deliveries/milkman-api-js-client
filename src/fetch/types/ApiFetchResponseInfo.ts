export interface ApiFetchResponseInfo<T_RES> {
  /** HTTP response */
  response?: Response
  /** HTTP Response body data */
  data?: T_RES
}

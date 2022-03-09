export interface ApiResponseInfo<T_RES> {
  /** HTTP original response */
  response: Response,
  /** HTTP Response body data */
  data: T_RES
  /** Additional data used for response management. */
  meta?: object
}

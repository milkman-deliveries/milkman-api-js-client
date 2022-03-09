export class ApiResponseInfo<T_RES> {
  /** HTTP original response */
  response: Response
  /** HTTP Response body data */
  data: T_RES
  /** Additional data used for response management. */
  meta?: object

  constructor(response: Response, data?: T_RES, meta: object = {}) {
    this.response = response
    this.data = data
    this.meta = meta
  }
}

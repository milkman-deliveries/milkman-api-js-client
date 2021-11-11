export interface ApiFetchInfo<T> {
  /** HTTP Request path */
  path: string
  /** HTTP Request method */
  method: string,
  /** HTTP Request body data */
  data?: T
  /** HTTP Request options. */
  options?: Partial<RequestInit>,
  /** Additional data used for requests management. */
  meta?: object
}

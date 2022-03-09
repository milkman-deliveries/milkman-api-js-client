export interface ApiResponseError {
  type: string
  text?: string
  field?: string
  value?: any
}

export interface ApiResponseData {
  errors?: ApiResponseError[]
  count?: number
  items?: object[]
}

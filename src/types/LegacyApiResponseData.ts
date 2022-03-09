export interface LegacyApiResponseError {
  code: string
  message?: string
}

export interface LegacyApiResponseData {
  result: {
    success: boolean
    errors?: LegacyApiResponseError[]
    count?: number
    entities?: object[]
  }
}

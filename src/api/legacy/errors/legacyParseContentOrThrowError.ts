import { LegacyApiError } from './LegacyApiError'

export const legacyParseContentOrThrowError = async (request: RequestInit, response: Response): Promise<any> => {
  let hasError = false
  let data

  // try to parse JSON response.
  try {
    data = await response.json()
  } catch (e) {
    hasError = true
  }

  if (!response.ok || !data?.result?.success || data?.result?.errors) hasError = true

  if (hasError) {
    const errors = data?.result?.errors
    throw new LegacyApiError(response.status, errors)
  }

  return data?.result
}

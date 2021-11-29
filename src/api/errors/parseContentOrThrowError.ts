import { ApiError } from './ApiError'

export const parseContentOrThrowError = async (request: RequestInit, response: Response): Promise<any> => {
  let hasError = false
  let data = null

  // try to parse JSON response.
  const bodyText = await response.text()
  if (bodyText) {
    try {
      data = JSON.parse(bodyText)
    } catch (e) {
      hasError = true
    }
  }

  if (!response.ok || data?.errors) hasError = true

  if (hasError) {
    const errors = data?.errors
    throw new ApiError(response.status, errors)
  }

  return data
}

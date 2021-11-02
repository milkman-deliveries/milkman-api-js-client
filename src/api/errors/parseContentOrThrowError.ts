import { ApiError } from './ApiError'

export const parseContentOrThrowError = async (request: RequestInit, response: Response): Promise<any> => {
  let hasError = false
  let data

  // try to parse JSON response.
  try {
    data = await response.json()
  } catch (e) {
    hasError = true
  }

  if (!response.ok || data?.errors) hasError = true

  if (hasError) {
    const errors = data?.errors
    throw new ApiError(response.status, errors)
  }

  return data
}

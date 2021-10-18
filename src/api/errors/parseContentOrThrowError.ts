import { ApiError } from './ApiError'

export const parseContentOrThrowError = async (response: Response): Promise<any> => {
  const data = await response.json()
  const isError = !response.ok || data.errors

  if (isError) {
    throw new ApiError(response.status, data.errors)
  }

  return data
}

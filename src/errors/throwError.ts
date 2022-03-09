import { ApiResponseData } from '../types/ApiResponseData'
import { ResponseHandler } from '../types/ResponseHandler'
import { ApiError } from './ApiError'

export const throwError: ResponseHandler<any, ApiResponseData, ApiResponseData> = async (requestInfo, responseInfo) => {
  if (!responseInfo.response.ok || responseInfo.data?.errors) {
    const errors = responseInfo.data?.errors
    throw new ApiError(responseInfo.response.status, errors)
  }

  return responseInfo
}

import { ApiResponseData } from '../fetch/types/ApiResponseData'
import { ResponseHandler } from '../fetch/types/ResponseHandler'
import { ApiError } from './ApiError'

export const throwError: ResponseHandler<any, ApiResponseData, ApiResponseData> = async (info) => {
  if (!info.response.ok || info.responseData?.errors) {
    const errors = info.responseData?.errors
    throw new ApiError(info.response.status, errors)
  }

  return info
}

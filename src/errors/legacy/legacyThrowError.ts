import { LegacyApiResponseResult } from '../../fetch/types/LegacyApiResponseData'
import { ResponseHandler } from '../../fetch/types/ResponseHandler'
import { LegacyApiError } from './LegacyApiError'

export const legacyThrowError: ResponseHandler<any, LegacyApiResponseResult, LegacyApiResponseResult> = async (requestInfo, responseInfo) => {
  if (!responseInfo.response.ok || !responseInfo.data?.success || responseInfo.data?.errors) {
    const errors = responseInfo.data?.errors
    throw new LegacyApiError(responseInfo.response.status, errors)
  }

  return responseInfo
}

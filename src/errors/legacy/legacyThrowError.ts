import { LegacyApiResponseResult } from '../../fetch/types/LegacyApiResponseData'
import { ResponseHandler } from '../../fetch/types/ResponseHandler'
import { LegacyApiError } from './LegacyApiError'

export const legacyThrowError: ResponseHandler<any, LegacyApiResponseResult, LegacyApiResponseResult> = async (info) => {
  if (!info.response.ok || !info.responseData?.success || info.responseData?.errors) {
    const errors = info.responseData?.errors
    throw new LegacyApiError(info.response.status, errors)
  }

  return info
}

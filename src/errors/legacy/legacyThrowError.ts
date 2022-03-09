import { LegacyApiResponseData } from '../../types/LegacyApiResponseData'
import { ResponseHandler } from '../../types/ResponseHandler'
import { LegacyApiError } from './LegacyApiError'


export const legacyThrowError: ResponseHandler<any, LegacyApiResponseData, LegacyApiResponseData> = async (requestInfo, responseInfo) => {
  if (!responseInfo.response.ok || !responseInfo.data?.result?.success || responseInfo.data?.result?.errors) {
    const errors = responseInfo.data?.result?.errors
    throw new LegacyApiError(responseInfo.response.status, errors)
  }

  return responseInfo
}

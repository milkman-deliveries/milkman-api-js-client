import { ApiFetch } from '../fetch/ApiFetch'
import { ApiRequestInfo } from './ApiRequestInfo'
import { ApiResponseInfo } from './ApiResponseInfo'

export type ResponseHandler<T_REQ, T_PREV_RES, T_HANDLED_RES> = (
  requestInfo: ApiRequestInfo<T_REQ>,
  responseInfo: ApiResponseInfo<T_PREV_RES>,
  _client: ApiFetch
) => Promise<ApiResponseInfo<T_HANDLED_RES>>

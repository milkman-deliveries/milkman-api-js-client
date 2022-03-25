import { ApiExecution } from '../ApiExecution'
import { ApiFetchRequestInfo } from './ApiFetchRequestInfo'
import { ApiFetchResponseInfo } from './ApiFetchResponseInfo'

export type ResponseHandler<T_REQ, T_PREV_RES, T_HANDLED_RES> = (
  requestInfo: ApiFetchRequestInfo<T_REQ>,
  responseInfo: ApiFetchResponseInfo<T_PREV_RES>,
  _execution: ApiExecution<any, any>
) => Promise<ApiFetchResponseInfo<T_HANDLED_RES>>

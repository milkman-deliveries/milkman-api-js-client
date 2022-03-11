import { ApiFetch } from '../ApiFetch';
import { ApiFetchResponseInfo } from './ApiFetchResponseInfo';
export declare type ResponseHandler<T_REQ, T_PREV_RES, T_HANDLED_RES> = (info: ApiFetchResponseInfo<T_REQ, T_PREV_RES>, _client: ApiFetch) => Promise<ApiFetchResponseInfo<T_REQ, T_HANDLED_RES>>;

import { ApiFetch } from '../fetch/ApiFetch';
import { ApiRequestInfo } from './ApiRequestInfo';
export declare type RequestEnhancer<T_PREV_REQ, T_ENHANCED_REQ> = (info: ApiRequestInfo<T_PREV_REQ>, _client: ApiFetch) => Promise<ApiRequestInfo<T_ENHANCED_REQ>>;

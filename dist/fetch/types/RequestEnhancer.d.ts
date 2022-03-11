import { ApiFetch } from '../ApiFetch';
import { ApiFetchRequestInfo } from './ApiFetchRequestInfo';
export declare type RequestEnhancer<T_PREV_REQ, T_NEXT_REQ> = (info: ApiFetchRequestInfo<T_PREV_REQ>, _client: ApiFetch) => Promise<ApiFetchRequestInfo<T_NEXT_REQ>>;

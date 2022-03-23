import { ApiExecution } from '../ApiExecution';
import { ApiFetchRequestInfo } from './ApiFetchRequestInfo';
export declare type RequestEnhancer<T_PREV_REQ, T_NEXT_REQ> = (requestInfo: ApiFetchRequestInfo<T_PREV_REQ>, _execution: ApiExecution<any, any>) => Promise<ApiFetchRequestInfo<T_NEXT_REQ>>;

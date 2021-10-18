import { ApiFetch } from '../api/ApiFetch';
import { ApiFetchInfo } from './ApiFetchInfo';
export declare type ResponseHandler<T, R_I, R_O> = (request: RequestInit, response: R_I, info: ApiFetchInfo<T>, _client: ApiFetch) => Promise<R_O>;

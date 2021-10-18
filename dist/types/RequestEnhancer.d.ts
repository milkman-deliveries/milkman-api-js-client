import { ApiFetch } from '../api/ApiFetch';
import { ApiFetchInfo } from './ApiFetchInfo';
export declare type RequestEnhancer<T> = (request: RequestInit, info: ApiFetchInfo<T>, _client: ApiFetch) => Promise<RequestInit>;

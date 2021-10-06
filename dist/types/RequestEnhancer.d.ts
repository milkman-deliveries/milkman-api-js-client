import { ApiClient } from '../api/ApiClient';
import { ApiFetchInfo } from './ApiFetchInfo';
export declare type RequestEnhancer = <T>(request: RequestInit, info: ApiFetchInfo<T>, _client: ApiClient) => Promise<RequestInit>;

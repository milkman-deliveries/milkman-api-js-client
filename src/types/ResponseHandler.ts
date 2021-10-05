import { ApiClient } from '../api/ApiClient'
import { ApiFetchInfo } from './ApiFetchInfo'

export type ResponseHandler = <T>(request: RequestInit, response: Response, info: ApiFetchInfo<T>, _client: ApiClient) => Promise<Response>

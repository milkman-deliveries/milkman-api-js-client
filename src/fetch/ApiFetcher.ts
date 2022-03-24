import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import 'isomorphic-fetch'
import { ApiExecution } from './ApiExecution'
import { ApiFetchRequestInfo } from './types/ApiFetchRequestInfo'
import { RequestEnhancer } from './types/RequestEnhancer'
import { ResponseHandler } from './types/ResponseHandler'

export interface ApiFetcherConfig {
  /** Base url for every API call. Default is "/". */
  baseUrl?: string,
  /** List of request enhancers. */
  requestEnhancers?: RequestEnhancer<any, any>[]
  /** List of response handlers. */
  responseHandlers?: ResponseHandler<any, any, any>[]
}

export class ApiFetcher {
  config: ApiFetcherConfig

  constructor(config: ApiFetcherConfig = {}) {
    this.config = config
  }

  async fetch<T_REQ, T_RES>(info: ApiFetchRequestInfo<T_REQ>): Promise<T_RES> {
    const execution = new ApiExecution<T_REQ, T_RES>(info, this.config)
    return execution.exec()
  }

  async GET<T_REQ, T_RES>(path: string, options: Partial<RequestInit> = {}): Promise<T_RES> {
    const info: ApiFetchRequestInfo<T_REQ> = { path, method: 'GET', options }
    return this.fetch(info)
  }

  async POST<T_REQ, T_RES>(path: string, data: T_REQ, options: Partial<RequestInit> = {}): Promise<T_RES> {
    const info: ApiFetchRequestInfo<T_REQ> = { path, method: 'POST', data, options }
    return this.fetch(info)
  }

  async PUT<T_REQ, T_RES>(path: string, data: T_REQ, options: Partial<RequestInit> = {}): Promise<T_RES> {
    const info: ApiFetchRequestInfo<T_REQ> = { path, method: 'PUT', data, options }
    return this.fetch(info)
  }

  async PATCH<T_REQ, T_RES>(path: string, data: T_REQ, options: Partial<RequestInit> = {}): Promise<T_RES> {
    const info: ApiFetchRequestInfo<T_REQ> = { path, method: 'PATCH', data, options }
    return this.fetch(info)
  }

  async DELETE<T_REQ, T_RES>(path: string, options: Partial<RequestInit> = {}): Promise<T_RES> {
    const info: ApiFetchRequestInfo<T_REQ> = { path, method: 'DELETE', options }
    return this.fetch(info)
  }
}

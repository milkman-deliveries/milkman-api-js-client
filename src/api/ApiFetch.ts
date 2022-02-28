import 'isomorphic-fetch'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import merge from 'lodash/merge'
import { ApiFetchInfo } from '../types/ApiFetchInfo'
import { RequestEnhancer } from '../types/RequestEnhancer'
import { ResponseHandler } from '../types/ResponseHandler'
import { defaultHeaders } from '../utils/defaultHeaders'

export interface ApiConfig {
  /** Base url for every API call. Default is "/". */
  baseUrl?: string,
  /** List of request enhancers. */
  requestEnhancers?: RequestEnhancer<any>[]
  /** List of response handlers. */
  responseHandlers?: ResponseHandler<any, any, any>[]
}

export class ApiFetch {
  baseUrl: string
  requestEnhancers?: RequestEnhancer<any>[]
  responseHandlers?: ResponseHandler<any, any, any>[]

  constructor(config: ApiConfig = {}) {
    this.baseUrl = config.baseUrl || '/'
    this.requestEnhancers = config.requestEnhancers || []
    this.responseHandlers = config.responseHandlers || []
  }

  composeUrl(path: string): string {
    const parsedBaseUrl = this.baseUrl.replace(/\/*$/, '')
    const parsedPath = path.replace(/^\/*/, '')
    return `${parsedBaseUrl}/${parsedPath}`
  }

  async applyRequestEnhancers<T>(request: RequestInit, info: ApiFetchInfo<T>): Promise<RequestInit> {
    return this.requestEnhancers.reduce<any>(async (prevRequest, enhancer) => {
      const awaitedPrevRequest = await prevRequest
      return await enhancer(awaitedPrevRequest, info, this)
    }, Promise.resolve(request))
  }

  async applyResponseHandlers<T>(request: RequestInit, response: Response, info: ApiFetchInfo<T>): Promise<any> {
    return this.responseHandlers.reduce<any>(async (prevResponse, handler) => {
      const awaitedPrevResponse = await prevResponse
      return await handler(request, awaitedPrevResponse, info, this)
    }, Promise.resolve(response))
  }

  async composeRequest<T>(info: ApiFetchInfo<T>, signal: AbortSignal): Promise<RequestInit> {
    const basicRequest: RequestInit = {
      method: info.method,
      signal,
      headers: defaultHeaders,
      body: JSON.stringify(info.data),
    }
    const request: RequestInit = merge(basicRequest, info.options)
    return this.applyRequestEnhancers(request, info)
  }

  async fetch<T>(info: ApiFetchInfo<T>): Promise<Response> {
    const url = this.composeUrl(info.path)
    const controller = new AbortController()
    const signal = controller.signal;
    const request = await this.composeRequest(info, signal)
    const response = await fetch(url, request)
    const responsePromise = this.applyResponseHandlers(request, response, info)
    // @ts-ignore
    responsePromise.cancel = () => controller.abort()
    return responsePromise
  }

  GET<T>(path: string, options?: any, meta?: object): Promise<Response> {
    const info: ApiFetchInfo<T> = { path, method: 'GET', options, meta }
    return this.fetch(info)
  }

  POST<T>(path: string, data: any, options?: any, meta?: object): Promise<Response> {
    const info: ApiFetchInfo<T> = { path, method: 'POST', data, options, meta }
    return this.fetch(info)
  }

  PUT<T>(path: string, data: T, options?: any, meta?: object): Promise<Response> {
    const info: ApiFetchInfo<T> = { path, method: 'PUT', data, options, meta }
    return this.fetch(info)
  }

  PATCH<T>(path: string, data: any, options?: any, meta?: object): Promise<Response> {
    const info: ApiFetchInfo<T> = { path, method: 'PATCH', data, options, meta }
    return this.fetch(info)
  }

  DELETE<T>(path: string, options?: any, meta?: object): Promise<Response> {
    const info: ApiFetchInfo<T> = { path, method: 'DELETE', options, meta }
    return this.fetch(info)
  }
}

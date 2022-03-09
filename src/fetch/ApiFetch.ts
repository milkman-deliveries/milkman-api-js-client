import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import 'isomorphic-fetch'
import merge from 'lodash/merge'
import { ApiRequestInfo } from '../types/ApiRequestInfo'
import { ApiResponseInfo } from '../types/ApiResponseInfo'
import { RequestEnhancer } from '../types/RequestEnhancer'
import { ResponseHandler } from '../types/ResponseHandler'
import { defaultHeaders } from '../utils/defaultHeaders'

export interface ApiFetchConfig {
  /** Base url for every API call. Default is "/". */
  baseUrl?: string,
  /** List of request enhancers. */
  requestEnhancers?: RequestEnhancer<any, any>[]
  /** List of response handlers. */
  responseHandlers?: ResponseHandler<any, any, any>[]
}

export class ApiFetch {
  baseUrl: string
  requestEnhancers?: RequestEnhancer<any, any>[]
  responseHandlers?: ResponseHandler<any, any, any>[]

  constructor(config: ApiFetchConfig = {}) {
    this.baseUrl = config.baseUrl || '/'
    this.requestEnhancers = config.requestEnhancers || []
    this.responseHandlers = config.responseHandlers || []
  }

  composeUrl(path: string): string {
    const parsedBaseUrl = this.baseUrl.replace(/\/*$/, '')
    const parsedPath = path.replace(/^\/*/, '')
    return `${parsedBaseUrl}/${parsedPath}`
  }

  async enhanceRequestInfo<T_INITIAL_REQ, T_ENHANCED_REQ>(
    requestInfo: ApiRequestInfo<T_INITIAL_REQ>
  ): Promise<ApiRequestInfo<T_ENHANCED_REQ>> {
    let enhancedRequestInfo: ApiRequestInfo<any> = requestInfo
    for (const enhancer of this.requestEnhancers) {
      enhancedRequestInfo = await enhancer(enhancedRequestInfo, this)
    }
    return enhancedRequestInfo
  }

  async applyResponseHandlers<T_REQ, T_INITIAL_RES, T_HANDLED_RES>(
    requestInfo: ApiRequestInfo<T_REQ>,
    responseInfo: ApiResponseInfo<T_INITIAL_RES>
  ): Promise<ApiResponseInfo<T_HANDLED_RES>> {
    let handledResponseInfo: ApiResponseInfo<any> = responseInfo
    for (const handler of this.responseHandlers) {
      handledResponseInfo = await handler(requestInfo, handledResponseInfo, this)
    }
    return handledResponseInfo
  }

  async composeRequest<T>(info: ApiRequestInfo<T>, signal: AbortSignal): Promise<RequestInit> {
    const basicRequest: RequestInit = {
      method: info.method,
      signal,
      headers: defaultHeaders,
      body: JSON.stringify(info.data),
    }
    return merge(basicRequest, info.options)
  }

  async fetch<T_REQ, T_RES>(requestInfo: ApiRequestInfo<T_REQ>): Promise<T_RES> {
    // create the controller (allows API request cancellation)
    const controller = new AbortController()
    // compose URL considering baseUrl
    const url = this.composeUrl(requestInfo.path)
    // apply any request enhancers to the initial request info
    const enhancedRequestInfo: ApiRequestInfo<any> = await this.enhanceRequestInfo<T_REQ, any>(requestInfo)
    // compose the request with the final (enhanced) request info
    const request = await this.composeRequest(enhancedRequestInfo, controller.signal)
    // do the request
    const response = await fetch(url, request)
    // compose the initial response info with just the response itself as data
    const responseInfo: ApiResponseInfo<Response> = { response, data: response }
    // apply any response handler to the initial response info
    const handledResponseInfoPromise = this.applyResponseHandlers<T_REQ, Response, T_RES>(enhancedRequestInfo, responseInfo)
    // @ts-ignore
    handledResponseInfoPromise.cancel = () => controller.abort()
    const handledResponseInfo: ApiResponseInfo<T_RES> = await handledResponseInfoPromise
    // return data from inside the final (handled) response info
    return handledResponseInfo.data
  }

  GET<T_REQ, T_RES>(path: string, options?: any, meta?: object): Promise<T_RES> {
    const info: ApiRequestInfo<T_REQ> = { path, method: 'GET', options, meta }
    return this.fetch<T_REQ, T_RES>(info)
  }

  POST<T_REQ, T_RES>(path: string, data: T_REQ, options?: any, meta?: object): Promise<T_RES> {
    const info: ApiRequestInfo<T_REQ> = { path, method: 'POST', data, options, meta }
    return this.fetch(info)
  }

  PUT<T_REQ, T_RES>(path: string, data: T_REQ, options?: any, meta?: object): Promise<T_RES> {
    const info: ApiRequestInfo<T_REQ> = { path, method: 'PUT', data, options, meta }
    return this.fetch(info)
  }

  PATCH<T_REQ, T_RES>(path: string, data: T_REQ, options?: any, meta?: object): Promise<T_RES> {
    const info: ApiRequestInfo<T_REQ> = { path, method: 'PATCH', data, options, meta }
    return this.fetch(info)
  }

  DELETE<T_REQ, T_RES>(path: string, options?: any, meta?: object): Promise<T_RES> {
    const info: ApiRequestInfo<T_REQ> = { path, method: 'DELETE', options, meta }
    return this.fetch(info)
  }
}

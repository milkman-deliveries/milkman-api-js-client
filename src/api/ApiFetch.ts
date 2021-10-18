import 'isomorphic-fetch'
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
    let enhancedRequest = request
    for (let i = 0; i < this.requestEnhancers.length; i++) {
      enhancedRequest = await this.requestEnhancers[i](request, info, this)
    }
    return enhancedRequest
  }

  async applyResponseHandlers<T>(request: RequestInit, response: Response, info: ApiFetchInfo<T>): Promise<any> {
    let managedResponse = response
    for (let i = 0; i < this.responseHandlers.length; i++) {
      managedResponse = await this.responseHandlers[i](request, managedResponse, info, this)
    }
    return managedResponse
  }

  async composeRequest<T>(info: ApiFetchInfo<T>): Promise<RequestInit> {
    const basicRequest = {
      method: info.method,
      headers: defaultHeaders,
      body: JSON.stringify(info.data),
    }
    const request = merge(basicRequest, info.options)
    return this.applyRequestEnhancers(request, info)
  }

  async fetch<T>(info: ApiFetchInfo<T>): Promise<Response> {
    const url = this.composeUrl(info.path)
    const request = await this.composeRequest(info)
    return fetch(url, request).then(response => (
      this.applyResponseHandlers(request, response, info)
    ))
  }

  GET<T>(path: string, options?: any): Promise<Response> {
    const info: ApiFetchInfo<T> = { path, method: 'GET', options }
    return this.fetch(info)
  }

  POST<T>(path: string, data: any, options?: any): Promise<Response> {
    const info: ApiFetchInfo<T> = { path, method: 'POST', data, options }
    return this.fetch(info)
  }

  PUT<T>(path: string, data: T, options?: any): Promise<Response> {
    const info: ApiFetchInfo<T> = { path, method: 'PUT', data, options }
    return this.fetch(info)
  }

  PATCH<T>(path: string, data: any, options?: any): Promise<Response> {
    const info: ApiFetchInfo<T> = { path, method: 'PATCH', data, options }
    return this.fetch(info)
  }

  DELETE<T>(path: string, options?: any): Promise<Response> {
    const info: ApiFetchInfo<T> = { path, method: 'DELETE', options }
    return this.fetch(info)
  }
}

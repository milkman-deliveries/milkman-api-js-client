import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'
import { defaultHeaders } from '../utils/defaultHeaders'
import { ApiFetcher, ApiFetcherConfig } from './ApiFetcher'
import { ApiFetchRequestInfo } from './types/ApiFetchRequestInfo'
import { ApiFetchResponseInfo } from './types/ApiFetchResponseInfo'
import { RequestEnhancer } from './types/RequestEnhancer'
import { ResponseHandler } from './types/ResponseHandler'

export class ApiExecution<T_REQ, T_RES> implements ApiFetcherConfig {
  baseUrl: string
  requestEnhancers?: RequestEnhancer<any, any>[]
  responseHandlers?: ResponseHandler<any, any, any>[]

  originalRequestInfo: ApiFetchRequestInfo<T_REQ>
  controller: AbortController = new AbortController() // allows API request cancellation

  // flags
  _abort: boolean = false
  _retry: boolean = false

  meta: object = {}

  constructor(requestInfo: ApiFetchRequestInfo<T_REQ>, fetcherConfig: ApiFetcherConfig) {
    this.originalRequestInfo = requestInfo

    this.baseUrl = fetcherConfig.baseUrl || '/'
    this.requestEnhancers = fetcherConfig.requestEnhancers || []
    this.responseHandlers = fetcherConfig.responseHandlers || []
  }

  restore(): void {
    this._abort = false
    this._retry = false
  }

  stop(): void {
    this._abort = true
  }

  retry(): void {
    this._retry = true
  }

  composeUrl(path: string): string {
    const parsedBaseUrl = this.baseUrl.replace(/\/*$/, '')
    const parsedPath = path.replace(/^\/*/, '')
    return `${parsedBaseUrl}/${parsedPath}`
  }

  composeRequest(requestInfo: ApiFetchRequestInfo<T_REQ>): RequestInit {
    const basicRequest: RequestInit = {
      method: requestInfo.method,
      signal: this.controller.signal,
      headers: defaultHeaders,
      body: JSON.stringify(requestInfo.data),
    }
    return merge(basicRequest, requestInfo.options)
  }

  async applyRequestEnhancers(
    requestInfo: ApiFetchRequestInfo<T_REQ>
  ): Promise<ApiFetchRequestInfo<unknown>> {
    let enhancedRequestInfo: ApiFetchRequestInfo<unknown> = requestInfo
    for (const enhancer of this.requestEnhancers) {
      enhancedRequestInfo = await this._execStep(() => enhancer(enhancedRequestInfo, this))
    }
    return enhancedRequestInfo
  }

  async applyResponseHandlers(
    requestInfo: ApiFetchRequestInfo<unknown>,
    responseInfo: ApiFetchResponseInfo<Response>
  ): Promise<ApiFetchResponseInfo<unknown>> {
    let handledResponseInfo: ApiFetchResponseInfo<unknown> = responseInfo
    for (const handler of this.responseHandlers) {
      handledResponseInfo = await this._execStep(() => handler(requestInfo, handledResponseInfo, this))
    }
    return handledResponseInfo
  }

  async fetch(
    requestInfo: ApiFetchRequestInfo<any>
  ): Promise<ApiFetchResponseInfo<Response>> {
    // compose URL considering baseUrl
    const url = this.composeUrl(requestInfo.path)
    // compose the request with the final (enhanced) request info
    const request = this.composeRequest(requestInfo)
    // do the request
    const response = await fetch(url, request)
    // compose response info
    return { response, data: response } as ApiFetchResponseInfo<Response>
  }

  async _execStep<T>(func: () => Promise<T>): Promise<T> {
    if (this._abort) return null
    const promise: Promise<T> = func()
    // @ts-ignore
    promise.cancel = () => this._controller.abort()
    return await promise
  }

  async exec(): Promise<T_RES> {
    this.restore()
    const requestInfo = cloneDeep(this.originalRequestInfo)

    const enhancedRequestInfo = await this.applyRequestEnhancers(requestInfo)
    const responseInfo = await this._execStep(() => this.fetch(enhancedRequestInfo))
    const handledResponseInfo = await this.applyResponseHandlers(enhancedRequestInfo, responseInfo)
    const res = await this._execStep(async () => handledResponseInfo.data as T_RES)

    if (this._retry) return this.exec()

    return res
  }
}

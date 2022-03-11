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

  get canGoOn(): boolean {
    return !this._abort
  }

  get mustRestart(): boolean {
    return this._retry
  }

  async _execStep<T>(func: () => Promise<T>): Promise<T> {
    if (!this.canGoOn) return null
    const promise: Promise<T> = func()
    // @ts-ignore
    promise.cancel = () => this._controller.abort()
    return await promise
  }

  // ---------------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------------

  async _prefetch(
    requestInfo: ApiFetchRequestInfo<T_REQ>
  ): Promise<ApiFetchRequestInfo<any>> {
    // apply any request enhancers to the initial request info
    return this.applyRequestEnhancers(requestInfo)
  }

  async _fetch(
    requestInfo: ApiFetchRequestInfo<any>
  ): Promise<ApiFetchResponseInfo<Response>> {
    // compose URL considering baseUrl
    const url = this.composeUrl(requestInfo.path)
    // compose the request with the final (enhanced) request info
    const request = this.composeRequest(requestInfo)
    // do the request
    const response = await this._execStep(() => fetch(url, request))
    // compose response info
    return { response, data: response } as ApiFetchResponseInfo<Response>
  }

  async _postfetch(
    requestInfo: ApiFetchRequestInfo<unknown>,
    responseInfo: ApiFetchResponseInfo<Response>
  ): Promise<ApiFetchResponseInfo<unknown>> {
    // apply any response handler to the initial response info
    return this.applyResponseHandlers(requestInfo, responseInfo)
  }

  async exec(): Promise<T_RES> {
    this.restore()
    const requestInfo = cloneDeep(this.originalRequestInfo)

    const enhancedRequestInfo = await this._prefetch(requestInfo)
    const responseInfo = await this._fetch(enhancedRequestInfo)
    const handledResponseInfo = await this._postfetch(enhancedRequestInfo, responseInfo)
    const res = handledResponseInfo.data as T_RES

    if (this.mustRestart) return this.exec()

    return res
  }
}

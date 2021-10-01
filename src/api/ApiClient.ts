import 'isomorphic-fetch'
import merge from 'lodash/merge'
import { defaultHeaders } from '../utils/defaultHeaders'
import { RequestEnhancer } from '../types/RequestEnhancer'

export interface ApiConfig {
  /** Base url for every API call. Default is "/". */
  baseUrl?: string,
  /** List of enhancers for API requests. */
  enhancers?: RequestEnhancer[]
}

export class ApiClient {
  baseUrl: string
  enhancers: RequestEnhancer[]

  constructor(config: ApiConfig = {}) {
    this.baseUrl = config.baseUrl || '/'
    this.enhancers = config.enhancers || []
  }

  composeUrl(url: string): string {
    let composedUrl = this.baseUrl.replace(/\/*$/, '')
    const parsedUrl = url.replace(/^\/*/, '')
    composedUrl += `/${parsedUrl}`
    return composedUrl
  }

  composeRequest(method, customOptions: RequestInit = {}): RequestInit {
    const basicOptions = {
      method,
      headers: defaultHeaders,
    }
    const request = merge(basicOptions, customOptions)
    return this.enhancers.reduce<RequestInit>(
      (enhancedRequest, enhancer) => {
        return enhancer(enhancedRequest)
      },
      request,
    )
  }

  fetch(method: string, url: string, options?: any): Promise<Response> {
    return fetch(
      this.composeUrl(url),
      this.composeRequest(method, options),
    )
  }

  GET(url: string, options?: any): Promise<Response> {
    return this.fetch('GET', url, options)
  }

  POST(url: string, data: any, options?: any): Promise<Response> {
    return this.fetch('POST', url, {
      body: JSON.stringify(data),
      ...options,
    })
  }

  PUT(url: string, data: any, options?: any): Promise<Response> {
    return this.fetch('PUT', url, {
      body: JSON.stringify(data),
      ...options,
    })
  }

  PATCH(url: string, data: any, options?: any): Promise<Response> {
    return this.fetch('PATCH', url, {
      body: JSON.stringify(data),
      ...options,
    })
  }

  DELETE(url: string, options?: any): Promise<Response> {
    return this.fetch('DELETE', url, options)
  }
}

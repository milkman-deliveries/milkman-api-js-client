import 'isomorphic-fetch'
import {retrieveIdToken} from '../utils/session'
import {RequestEnhancer} from "./RequestEnhancer";

export interface ApiConfig {
  /** Base url for every API call. Default is "/". */
  baseUrl?: string,
  /** List of enhancers for API requests. */
  enhancers?: RequestEnhancer[]
}

export const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
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
    const { headers, ...otherOptions } = customOptions
    const request = {
      method,
      headers: {
        ...defaultHeaders,
        ...headers
      },
      ...otherOptions
    }
    return this.enhancers.reduce<RequestInit>(
      (enhancedRequest, enhancer) => {
        return enhancer(enhancedRequest)
      },
      request
    )
  }

  fetch(method: string, url: string, options?: any): Promise<Response> {
    return fetch(
      this.composeUrl(url),
      this.composeRequest(method, options)
    )
  }

  get(url: string, options?: any): Promise<Response> {
    return this.fetch('GET', url, options)
  }

  post(url: string, data: any, options?: any): Promise<Response> {
    return this.fetch('POST', url, {
      body: JSON.stringify(data),
      ...options
    })
  }

  put(url: string, data: any, options?: any): Promise<Response> {
    return this.fetch('PUT', url, {
      body: JSON.stringify(data),
      ...options
    })
  }

  patch(url: string, data: any, options?: any): Promise<Response> {
    return this.fetch('PATCH', url, {
      body: JSON.stringify(data),
      ...options
    })
  }

  delete(url: string, options?: any): Promise<Response> {
    return this.fetch('DELETE', url, options)
  }
}
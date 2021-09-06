import 'isomorphic-fetch'
import { retrieveIdToken } from './utils/session'

export type ApiHeader = { [key: string]: string }
export type ApiOptions = { [key: string]: any }

export interface ApiConfig {
  /** Base url for every API call. Default is "/". */
  baseUrl?: string
}

export const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

export class ApiClient {
  baseUrl?: string

  constructor(config: ApiConfig = {}) {
    this.baseUrl = config.baseUrl
  }

  composeUrl(url: string): string {
    let composedUrl = ''
    if (this.baseUrl) {
      composedUrl += this.baseUrl.replace(/\/*$/, '')
    }
    const parsedUrl = url.replace(/^\/*/, '')
    composedUrl += `/${parsedUrl}`
    return composedUrl
  }

  composeHeaders(customHeaders: ApiHeader = {}): ApiHeader {
    return {
      ...defaultHeaders,
      authorization: `Bearer ${retrieveIdToken()}`,
      ...customHeaders
    }
  }

  composeOptions(method, customOptions: ApiOptions = {}): ApiOptions {
    const { headers, ...otherOptions } = customOptions
    return {
      method,
      headers: this.composeHeaders(headers),
      ...otherOptions
    }
  }

  fetch(method, url, options) {
    return fetch(
      this.composeUrl(url),
      this.composeOptions(method, options)
    )
  }

  get(url: string, options: any) {
    this.fetch('GET', url, options)
  }

  post(url: string, data: any, options: any) {
    this.fetch('POST', url, {
      body: JSON.stringify(data),
      ...options
    })
  }

  put(url: string, data: any, options: any) {
    this.fetch('PUT', url, {
      body: JSON.stringify(data),
      ...options
    })
  }

  patch(url: string, data: any, options: any) {
    this.fetch('PATCH', url, {
      body: JSON.stringify(data),
      ...options
    })
  }

  delete(url: string, options: any) {
    this.fetch('DELETE', url, options)
  }
}

import { RequestEnhancer } from '../types/RequestEnhancer'
import { retrieveIdToken } from './sessionStorage'

export const injectAuthorizationToken: RequestEnhancer = async request => {
  if (!request.headers) request.headers = {}
  request.headers['authorization'] = `Bearer ${retrieveIdToken()}`
  return request
}

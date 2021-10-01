import { RequestEnhancer } from '../types/RequestEnhancer'
import { retrieveIdToken } from './sessionStorage'

export const authEnhancer: RequestEnhancer = request => {
  if (!request.headers) request.headers = {}
  request.headers['authorization'] = `Bearer ${retrieveIdToken()}`
  return request
}

import { RequestEnhancer } from '../api/RequestEnhancer'
import { retrieveIdToken } from './session'

export const authEnhancer: RequestEnhancer = request => {
  if (!request.headers) request.headers = {}
  request.headers['authorization'] = `Bearer ${retrieveIdToken()}`
  return request
}

import { RequestEnhancer } from '../../api/RequestEnhancer'
import { retrieveSessionToken } from '../session'

export const legacyAuthEnhancer: RequestEnhancer = request => {
  if (!request.headers) request.headers = {}
  request.headers['session'] = retrieveSessionToken()
  return request
}
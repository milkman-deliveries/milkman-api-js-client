import { RequestEnhancer } from '../../types/RequestEnhancer'
import { retrieveSessionToken } from '../sessionStorage'

export const injectLegacySessionToken: RequestEnhancer = async request => {
  if (!request.headers) request.headers = {}
  request.headers['session'] = retrieveSessionToken()
  return request
}

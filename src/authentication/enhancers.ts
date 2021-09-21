import {retrieveIdToken, retrieveSessionToken} from '../utils/session'

export const cognitoHeaderEnhancer = (request: RequestInit): RequestInit => {
  if (!request.headers) request.headers = {}
  request.headers['Authorization'] = `Bearer ${retrieveIdToken()}`
  return request
}

export const sessionHeaderEnhancer = (request: RequestInit): RequestInit => {
  if (!request.headers) request.headers = {}
  request.headers['session'] = retrieveSessionToken()
  return request
}

import { TokenStore } from '../storage/TokenStore'
import { RequestEnhancer } from '../types/RequestEnhancer'

export const injectAuthorizationTokenFactory = <T extends TokenStore>(idTokenStore: T): RequestEnhancer<any> => (
  async request => {
    if (!request.headers) request.headers = {}
    request.headers['authorization'] = `Bearer ${idTokenStore.retrieve()}`
    return request
  }
)

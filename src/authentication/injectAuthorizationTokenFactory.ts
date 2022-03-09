import { TokenStore } from '../storage/TokenStore'
import { RequestEnhancer } from '../types/RequestEnhancer'

export const injectAuthorizationTokenFactory = <T extends TokenStore, T_REQ>(idTokenStore: T): RequestEnhancer<T_REQ, T_REQ> => (
  async (requestInfo) => {
    if (!requestInfo.options.headers) requestInfo.options.headers = {}
    requestInfo.options.headers['authorization'] = `Bearer ${idTokenStore.retrieve()}`
    return requestInfo
  }
)

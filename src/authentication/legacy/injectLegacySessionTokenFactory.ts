import { TokenStore } from '../../storage/TokenStore'
import { RequestEnhancer } from '../../fetch/types/RequestEnhancer'

export const injectLegacySessionTokenFactory = <T extends TokenStore, T_REQ>(sessionTokenStore: T): RequestEnhancer<T_REQ, T_REQ> => (
  async (requestInfo) => {
    if (!requestInfo.options.headers) requestInfo.options.headers = {}
    requestInfo.options.headers['session'] = sessionTokenStore.retrieve()
    return requestInfo
  }
)

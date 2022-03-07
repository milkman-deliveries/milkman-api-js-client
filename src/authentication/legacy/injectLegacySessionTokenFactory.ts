import { TokenStore } from '../../storage/TokenStore'
import { RequestEnhancer } from '../../types/RequestEnhancer'

export const injectLegacySessionTokenFactory = <T extends TokenStore>(sessionTokenStore: T): RequestEnhancer<any> => (
  async request => {
    if (!request.headers) request.headers = {}
    request.headers['session'] = sessionTokenStore.retrieve()
    return request
  }
)

import { ApiRequestInfo } from '../../types/ApiRequestInfo'
import { injectLegacySessionTokenFactory } from './injectLegacySessionTokenFactory'

class MockedStore {
  constructor(key, value) {
    this.key = key
    this.value = value
  }

  retrieve() {
    return this.value
  }

  store(value) {
  }
}

describe('injectLegacySessionTokenFactory', () => {

  const createEnhancer = (value) => injectLegacySessionTokenFactory(new MockedStore('key', value))

  it('injects session token in request header', async () => {
    const injectLegacySessionToken = createEnhancer('session token value')

    const requestInfo = new ApiRequestInfo('/foo/path', 'GET')
    const enhancedRequestInfo = await injectLegacySessionToken(requestInfo, undefined)
    expect(enhancedRequestInfo.options.headers.session).toBeDefined()
    expect(enhancedRequestInfo.options.headers.session).toEqual('session token value')
  })
})

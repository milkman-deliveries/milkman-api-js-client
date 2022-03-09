import { ApiRequestInfo } from '../types/ApiRequestInfo'
import { injectAuthorizationTokenFactory } from './injectAuthorizationTokenFactory'

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

describe('injectAuthorizationTokenFactory', () => {

  const createEnhancer = (value) => injectAuthorizationTokenFactory(new MockedStore('key', value))

  it('injects session token in request header', async () => {
    const injectAuthorizationToken = createEnhancer('session token value')

    const requestInfo = new ApiRequestInfo('/foo/path', 'GET')
    const enhancedRequestInfo = await injectAuthorizationToken(requestInfo, undefined)
    expect(enhancedRequestInfo.options.headers.authorization).toBeDefined()
    expect(enhancedRequestInfo.options.headers.authorization).toEqual('Bearer session token value')
  })
})

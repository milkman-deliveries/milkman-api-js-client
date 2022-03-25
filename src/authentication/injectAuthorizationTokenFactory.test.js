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

    const info = { meta: {}, path: '/foo/path', method: 'GET', options: {} }
    const enhancedInfo = await injectAuthorizationToken(info, undefined)
    expect(enhancedInfo.options.headers.authorization).toBeDefined()
    expect(enhancedInfo.options.headers.authorization).toEqual('Bearer session token value')
  })
})

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

    const info = { meta: {}, path: '/foo/path', method: 'GET', options: {} }
    const enhancedInfo = await injectLegacySessionToken(info, undefined)
    expect(enhancedInfo.options.headers.session).toBeDefined()
    expect(enhancedInfo.options.headers.session).toEqual('session token value')
  })
})

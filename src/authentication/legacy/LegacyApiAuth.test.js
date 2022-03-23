import { mockFetch } from '../../../jest/mocks/fetch.mock'
import { defaultHeaders } from '../../utils/defaultHeaders'
import { LEGACY_SESSION_TOKEN_KEY, LegacyApiAuth } from './LegacyApiAuth'

class MockedTokenStore {
  constructor(key, val) {
    this.key = key
    this.val = val
  }

  retrieve() {
    return this.val
  }

  store(value) {
    // do nothing
  }
}

const authBasicConfig = {
  baseUrl: 'http://base.url',
  sessionTokenStore: new MockedTokenStore(LEGACY_SESSION_TOKEN_KEY, ''),
}

describe('LegacyApiAuth', () => {

  describe('login()', () => {
    it('compose correct request', async () => {
      const fetch = mockFetch((...params) => Promise.resolve({
        ok: true,
        json: () => ({
          result: {
            success: true,
            session: 'foo session',
            params,
          },
        })
      }))
      const auth = new LegacyApiAuth(authBasicConfig)
      const authParams = { username: 'username', password: 'password' }
      const res = await auth._login(authParams)
      expect(fetch).toHaveBeenCalled()
      expect(fetch.mock.lastCall[0]).toEqual('http://base.url/milkman/login')
      expect(fetch.mock.lastCall[1].method).toEqual('POST')
      expect(fetch.mock.lastCall[1].headers).toEqual(defaultHeaders)
      expect(fetch.mock.lastCall[1].body).toEqual(JSON.stringify(authParams))
      expect(res).toEqual('foo session')
    })
  })
})

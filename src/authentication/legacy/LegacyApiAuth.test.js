import { LegacyApiAuth } from '../../../dist'
import { mockFetch } from '../../jest/mocks/fetch.mock'
import { ApiAuth, COGNITO_ENDPOINT, COGNITO_ID_TOKEN_KEY, COGNITO_REFRESH_TOKEN_KEY } from './ApiAuth'

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
  application: 'test',
  clientId: 'test123',
  idTokenStore: new MockedTokenStore(COGNITO_ID_TOKEN_KEY, ''),
  refreshTokenStore: new MockedTokenStore(COGNITO_REFRESH_TOKEN_KEY, 'testRefreshToken')
}

describe('LegacyApiAuth', () => {
  describe('authUrl', () => {
    it('compose application auth endpoint', () => {
      const auth = new LegacyApiAuth(authBasicConfig)
      expect(auth.cognitoAuthUrl).toEqual(`${COGNITO_ENDPOINT}test/login`)
    })
  })

  describe('cognitoLogin()', () => {
    it('compose correct request', () => {
      const fetch = mockFetch((...args) => ({ AuthenticationResult: args }))
      const auth = new ApiAuth(authBasicConfig)
      auth
        ._cognitoLogin('username', 'password')
        .then(([url, options]) => {
          expect(fetch).toHaveBeenCalled()
          expect(options).toEqual({
            method: 'POST',
            headers: {
              Accept: 'application/json'
            },
            body: JSON.stringify({
              ClientId: 'test123',
              AuthFlow: 'USER_PASSWORD_AUTH',
              AuthParameters: {
                USERNAME: 'username',
                PASSWORD: 'password'
              }
            })
          })
        })
    })
  })

  describe('cognitoRefresh()', () => {
    it('compose correct request', () => {
      const fetch = mockFetch((...args) => ({ AuthenticationResult: args }))
      const auth = new ApiAuth(authBasicConfig)
      auth
        ._cognitoRefresh()
        .then(([url, options]) => {
          expect(fetch).toHaveBeenCalled()
          expect(url).toEqual(`${COGNITO_ENDPOINT}test/login`)
          expect(options).toEqual({
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: JSON.stringify({
              ClientId: 'test123',
              AuthFlow: 'REFRESH_TOKEN_AUTH',
              AuthParameters: {
                REFRESH_TOKEN: 'testRefreshToken'
              }
            })
          })
        })
    })
  })
})

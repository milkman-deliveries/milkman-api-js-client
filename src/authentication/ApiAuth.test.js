import { mockFetch } from '../../jest/mocks/fetch.mock'
import { retrieveRefreshToken, storeIdToken } from '../utils/session'
import { ApiAuth, AuthenticationMethod, COGNITO_ENDPOINT } from './ApiAuth'

const authBasicConfig = {
  application: 'test',
  clientId: 'test123'
}

const cognitoLoginSuccessResponse = {
  AuthenticationResult: {
    IdToken: 'testIdToken',
    RefreshToken: 'testRefreshToken'
  }
}

jest.mock('../utils/session', () => ({
  storeIdToken: () => undefined,
  storeRefreshToken: () => undefined,
  retrieveRefreshToken: () => 'testRefreshToken'
}))

describe('ApiAuth', () => {
  describe('authUrl', () => {
    it('compose application auth endpoint', () => {
      const auth = new ApiAuth(authBasicConfig)
      expect(auth.authUrl).toEqual(`${COGNITO_ENDPOINT}test/login`)
    })
  })

  describe('cognitoLogin()', () => {
    it('compose correct request', () => {
      const auth = new ApiAuth(authBasicConfig)
      const fetch = mockFetch()
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
                PASSWORD: 'password',
              }
            })
          })
        })
    })
  })

  describe('cognitoRefresh()', () => {
    it('compose correct request', () => {
      const auth = new ApiAuth(authBasicConfig)
      const fetch = mockFetch()
      auth
        ._cognitoRefresh('username', 'password')
        .then(([url, options]) => {
          expect(fetch).toHaveBeenCalled()
          expect(options).toEqual({
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: JSON.stringify({
              ClientId: 'test123',
              AuthFlow: 'REFRESH_TOKEN_AUTH',
              AuthParameters: {
                REFRESH_TOKEN: 'testRefreshToken',
              }
            })
          })
        })
    })
  })


  describe('standard behavior', () => {
    const auth = new ApiAuth({
      application: 'test',
      clientId: 'test123'
    })

    it('login()', () => {
      const fetch = mockFetch(() => cognitoLoginSuccessResponse)
      auth
        .login('username', 'password')
        .then(response => {
          expect(fetch).toHaveBeenCalled()
          expect(response).toEqual(true)
        })
        .catch(e => {
          console.log(e)
        })
    })
  })
})

import { ApiClient } from './ApiClient'
import { retrieveIdToken } from '../utils/session'

// const api = new ApiClient({ baseUrl: 'https://www.test.it' })
//
// const query = new ApiQuery().eq('test')
// const sort = new ApiSort().asc('name')
//
// api.get(`/milkman/orders?query=${query}&sort=${sort}`)

jest.mock('./utils/session', () => ({
  __esModule: true,
  retrieveIdToken: jest.fn(() => 'TEST_ID_TOKEN'),
}))

describe('ApiSort', () => {

  describe('composeUrl', () => {
    it ('works with no baseUrl', () => {
      const api = new ApiClient()
      expect(api.composeUrl('test')).toEqual('/test')
      expect(api.composeUrl('/test')).toEqual('/test')
      expect(api.composeUrl('//test')).toEqual('/test')
    })
    it ('works with baseUrl', () => {
      const api = new ApiClient({ baseUrl: 'http://www.test.com' })
      expect(api.composeUrl('test')).toEqual('http://www.test.com/test')
      expect(api.composeUrl('/test')).toEqual('http://www.test.com/test')
      expect(api.composeUrl('//test')).toEqual('http://www.test.com/test')
    })
  })

  describe('composeHeaders', () => {

    it ('with no custom headers', () => {
      const api = new ApiClient()

      expect(api.composeHeaders()).toEqual({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Bearer TEST_ID_TOKEN`,
      })
    })

    it ('with custom headers', () => {
      const api = new ApiClient()
      const customHeaders = {
        customHeader1: 'test test test',
        customHeader2: 'another test'
      }
      expect(api.composeHeaders(customHeaders)).toEqual({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Bearer TEST_ID_TOKEN`,
        ...customHeaders
      })
    })
  })

  describe('composeOptions', () => {

    it ('with no custom options', () => {
      const api = new ApiClient()
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Bearer TEST_ID_TOKEN`,
      }

      expect(api.composeRequest('GET')).toEqual({
        method: 'GET',
        headers
      })
    })

    it ('with custom options', () => {
      const api = new ApiClient()
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Bearer TEST_ID_TOKEN`,
      }
      const options = {
        customOption: 'customOption value',
        headers: {
          customHeader: 'customHeader value'
        }
      }

      expect(api.composeRequest('GET', options)).toEqual({
        method: 'GET',
        headers: {
          ...headers,
          customHeader: 'customHeader value'
        },
        customOption: 'customOption value'
      })
    })
  })

})

import { defaultHeaders } from '../utils/defaultHeaders'
import { ApiClient } from './ApiClient'

describe('ApiSort', () => {

  describe('composeUrl', () => {
    it('works with no baseUrl', () => {
      const api = new ApiClient()
      expect(api.composeUrl('test')).toEqual('/test')
      expect(api.composeUrl('/test')).toEqual('/test')
      expect(api.composeUrl('//test')).toEqual('/test')
    })
    it('works with baseUrl', () => {
      const api = new ApiClient({ baseUrl: 'http://www.test.com' })
      expect(api.composeUrl('test')).toEqual('http://www.test.com/test')
      expect(api.composeUrl('/test')).toEqual('http://www.test.com/test')
      expect(api.composeUrl('//test')).toEqual('http://www.test.com/test')
    })
  })

  describe('composeRequest', () => {
    it('basic', () => {
      const api = new ApiClient()
      expect(api.composeRequest('GET')).toEqual({
        method: 'GET',
        headers: defaultHeaders
      })
    })

    it('with custom headers', () => {
      const api = new ApiClient()
      const headers = {
        customHeader1: 'test test test',
        customHeader2: 'another test'
      }
      expect(api.composeRequest('GET', { headers })).toEqual({
        method: 'GET',
        headers: { ...defaultHeaders, ...headers }
      })
    })

    it('with custom options', () => {
      const api = new ApiClient()
      const options = {
        integrity: 'test test test',
        keepalive: false
      }
      expect(api.composeRequest('GET', options)).toEqual({
        method: 'GET',
        headers: defaultHeaders,
        ...options
      })
    })
  })
})

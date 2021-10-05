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
    it('basic', async () => {
      const api = new ApiClient()
      const req = await api.composeRequest({ method: 'GET', path: '/' })
      expect(req).toEqual({
        method: 'GET',
        headers: defaultHeaders
      })
    })

    it('with custom headers', async () => {
      const api = new ApiClient()
      const headers = {
        customHeader1: 'test test test',
        customHeader2: 'another test'
      }
      const req = await api.composeRequest({
        method: 'GET',
        path: '/',
        options: { headers }
      })
      expect(req).toEqual({
        method: 'GET',
        headers: { ...defaultHeaders, ...headers }
      })
    })

    it('with custom options', async () => {
      const api = new ApiClient()
      const options = {
        integrity: 'test test test',
        keepalive: false
      }
      const req = await api.composeRequest({
        method: 'GET',
        path: '/',
        options
      })
      expect(req).toEqual({
        method: 'GET',
        headers: defaultHeaders,
        ...options
      })
    })
  })

  describe('middleware', () => {

    it('requestEnhancer', async () => {
      const info = { method: 'GET', path: '/' }
      const enhanceRequest = req => {
        req.test = 'test'
        return req
      }
      const api = new ApiClient({ requestEnhancers: [enhanceRequest] })
      const req = await api.composeRequest(info)
      expect(req).toEqual({
        method: 'GET',
        headers: defaultHeaders,
        test: 'test'
      })
    })

    it('responseHandler', async () => {
      const info = { method: 'GET', path: '/' }
      const handleResponse = (req, res) => {
        res.test = 'test'
        return res
      }
      const api = new ApiClient({ responseHandlers: [handleResponse] })
      const res = await api.applyResponseHandlers(undefined, {}, info)
      expect(res).toEqual({
        test: 'test'
      })
    })
  })
})

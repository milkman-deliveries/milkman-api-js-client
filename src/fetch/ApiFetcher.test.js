import { defaultHeaders } from '../utils/defaultHeaders'
import { ApiFetcher } from './ApiFetcher'

describe('ApiFetch', () => {

  describe('composeUrl', () => {
    it('works with no baseUrl', () => {
      const api = new ApiFetcher()
      expect(api.composeUrl('test')).toEqual('/test')
      expect(api.composeUrl('/test')).toEqual('/test')
      expect(api.composeUrl('//test')).toEqual('/test')
    })
    it('works with baseUrl', () => {
      const api = new ApiFetcher({ baseUrl: 'http://www.test.com' })
      expect(api.composeUrl('test')).toEqual('http://www.test.com/test')
      expect(api.composeUrl('/test')).toEqual('http://www.test.com/test')
      expect(api.composeUrl('//test')).toEqual('http://www.test.com/test')
    })
  })

  describe('composeRequest', () => {
    it('basic', async () => {
      const api = new ApiFetcher()
      const req = await api.composeRequest({ meta: {}, method: 'GET', path: '/', options: {} }, undefined)
      expect(req).toEqual({
        method: 'GET',
        headers: defaultHeaders
      })
    })

    it('with custom headers', async () => {
      const api = new ApiFetcher()
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
      const api = new ApiFetcher()
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
      const enhancer = (reqInfo) => {
        reqInfo.options.test = 'test'
        reqInfo.meta.counter = 123
        return reqInfo
      }
      const fetcher = new ApiFetcher({ requestEnhancers: [enhancer] })
      const info = { meta: {}, path: '/foo/path', method: 'GET', options: {} }

      const enhancedInfo = await fetcher.applyRequestEnhancers(info)
      expect(enhancedInfo.options.test).toBeDefined()
      expect(enhancedInfo.options.test).toEqual('test')
      expect(enhancedInfo.meta.counter).toBeDefined()
      expect(enhancedInfo.meta.counter).toEqual(123)

      const req = await fetcher.composeRequest(info, undefined)
      expect(req.test).toBeDefined()
      expect(req.test).toEqual('test')
    })

    it('responseHandler', async () => {
      const handleResponse = (info) => {
        info.response.test = 'test'
        info.data = 'data'
        return info
      }
      const fetcher = new ApiFetcher({ responseHandlers: [handleResponse] })
      const info = { meta: {}, path: '/foo/path', method: 'GET', options: {}, response: new Response() }
      const handledInfo = await fetcher.applyResponseHandlers(info)
      expect(handledInfo.response.test).toBeDefined()
      expect(handledInfo.response.test).toEqual('test')
      expect(handledInfo.data).toBeDefined()
      expect(handledInfo.data).toEqual('data')
    })
  })
})

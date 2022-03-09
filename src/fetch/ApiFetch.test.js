import { ApiRequestInfo } from '../types/ApiRequestInfo'
import { ApiResponseInfo } from '../types/ApiResponseInfo'
import { defaultHeaders } from '../utils/defaultHeaders'
import { ApiFetch } from './ApiFetch'

describe('ApiFetch', () => {

  describe('composeUrl', () => {
    it('works with no baseUrl', () => {
      const api = new ApiFetch()
      expect(api.composeUrl('test')).toEqual('/test')
      expect(api.composeUrl('/test')).toEqual('/test')
      expect(api.composeUrl('//test')).toEqual('/test')
    })
    it('works with baseUrl', () => {
      const api = new ApiFetch({ baseUrl: 'http://www.test.com' })
      expect(api.composeUrl('test')).toEqual('http://www.test.com/test')
      expect(api.composeUrl('/test')).toEqual('http://www.test.com/test')
      expect(api.composeUrl('//test')).toEqual('http://www.test.com/test')
    })
  })

  describe('composeRequest', () => {
    it('basic', async () => {
      const api = new ApiFetch()
      const req = await api.composeRequest({ method: 'GET', path: '/' })
      expect(req).toEqual({
        method: 'GET',
        headers: defaultHeaders
      })
    })

    it('with custom headers', async () => {
      const api = new ApiFetch()
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
      const api = new ApiFetch()
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
      const fetcher = new ApiFetch({ requestEnhancers: [enhancer] })
      const info = new ApiRequestInfo('/foo/path', 'GET')

      const enhancedInfo = await fetcher.enhanceRequestInfo(info)
      expect(enhancedInfo.options.test).toBeDefined()
      expect(enhancedInfo.options.test).toEqual('test')
      expect(enhancedInfo.meta.counter).toBeDefined()
      expect(enhancedInfo.meta.counter).toEqual(123)

      const req = await fetcher.composeRequest(info, undefined)
      expect(req.test).toBeDefined()
      expect(req.test).toEqual('test')
    })

    it('responseHandler', async () => {
      const handleResponse = (req, res) => {
        res.response.test = 'test'
        res.data = 'data'
        return res
      }
      const fetcher = new ApiFetch({ responseHandlers: [handleResponse] })
      const reqInfo = new ApiRequestInfo('/foo/path', 'GET')
      const resInfo = new ApiResponseInfo(new Response())
      const handledInfo = await fetcher.applyResponseHandlers(reqInfo, resInfo)
      expect(handledInfo.response.test).toBeDefined()
      expect(handledInfo.response.test).toEqual('test')
      expect(handledInfo.data).toBeDefined()
      expect(handledInfo.data).toEqual('data')
    })
  })
})

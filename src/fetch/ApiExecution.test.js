import Sinon from 'sinon'
import { mockAbortController } from '../../jest/mocks/AbortController.mock'
import { defaultHeaders } from '../utils/defaultHeaders'
import { ApiExecution } from './ApiExecution'
import { ApiFetcher } from './ApiFetcher'

const sandbox = Sinon.createSandbox()

describe('ApiExecution', () => {
  let enhancer1
  let enhancer2
  let handler1
  let handler2
  let abort;

  beforeEach(() => {
    enhancer1 = sandbox.stub()
    enhancer2 = sandbox.stub()
    handler1 = sandbox.stub()
    handler2 = sandbox.stub()
    abort = sandbox.stub()

    mockAbortController(abort)
  })

  afterEach(() => {
    sandbox.restore()
  })

  const createApiExecution = (requestInfo = {}, customConfig = {}) => {
    const fetcherConfig = {
      baseUrl: 'http://www.test.com',
      requestEnhancers: [enhancer1, enhancer2],
      responseHandlers: [handler1, handler2],
      ...customConfig
    }
    return new ApiExecution(requestInfo, fetcherConfig)
  }

  describe('composeUrl', () => {
    it('works with baseUrl', () => {
      const execution = createApiExecution()

      expect(execution.composeUrl('test')).toEqual('http://www.test.com/test')
      expect(execution.composeUrl('/test')).toEqual('http://www.test.com/test')
      expect(execution.composeUrl('//test')).toEqual('http://www.test.com/test')
    })

    it('works with no baseUrl', () => {
      const execution = createApiExecution({}, { baseUrl: undefined })

      expect(execution.composeUrl('test')).toEqual('/test')
      expect(execution.composeUrl('/test')).toEqual('/test')
      expect(execution.composeUrl('//test')).toEqual('/test')
    })
  })

  describe('composeRequest', () => {
    it('basic', async () => {
      const execution = createApiExecution()
      const req = await execution.composeRequest({ method: 'GET', path: '/', options: {} })
      expect(req).toEqual({
        method: 'GET',
        headers: defaultHeaders,
        body: undefined,
        signal: 'foo signal',
      })
    })

    it('with custom headers', async () => {
      const execution = createApiExecution()
      const headers = {
        customHeader1: 'test test test',
        customHeader2: 'another test'
      }
      const req = await execution.composeRequest({ method: 'GET', path: '/', options: { headers } })
      expect(req).toEqual({
        method: 'GET',
        headers: { ...defaultHeaders, ...headers },
        body: undefined,
        signal: 'foo signal',
      })
    })

    it('with custom options', async () => {
      const execution = createApiExecution()
      const options = {
        integrity: 'test test test',
        keepalive: false
      }
      const req = await execution.composeRequest({ method: 'GET', path: '/', options })
      expect(req).toEqual({
        method: 'GET',
        headers: defaultHeaders,
        body: undefined,
        signal: 'foo signal',
        ...options
      })
    })
  })

  // describe('applyRequestEnhancers', () => {
  //   it('basic', () => {
  //     const execution = createApiExecution()
  //   })
  // })
  //
  // describe('middleware', () => {
  //
  //   xit('requestEnhancer', async () => {
  //     const enhancer = (reqInfo) => {
  //       reqInfo.options.test = 'test'
  //       reqInfo.meta.counter = 123
  //       return reqInfo
  //     }
  //     const fetcher = new ApiFetcher({ requestEnhancers: [enhancer] })
  //     const info = { meta: {}, path: '/foo/path', method: 'GET', options: {} }
  //
  //     const enhancedInfo = await fetcher.applyRequestEnhancers(info)
  //     expect(enhancedInfo.options.test).toBeDefined()
  //     expect(enhancedInfo.options.test).toEqual('test')
  //     expect(enhancedInfo.meta.counter).toBeDefined()
  //     expect(enhancedInfo.meta.counter).toEqual(123)
  //
  //     const req = await fetcher.composeRequest(info, undefined)
  //     expect(req.test).toBeDefined()
  //     expect(req.test).toEqual('test')
  //   })
  //
  //   xit('responseHandler', async () => {
  //     const handleResponse = (info) => {
  //       info.response.test = 'test'
  //       info.data = 'data'
  //       return info
  //     }
  //     const fetcher = new ApiFetcher({ responseHandlers: [handleResponse] })
  //     const info = { meta: {}, path: '/foo/path', method: 'GET', options: {}, response: new Response() }
  //     const handledInfo = await fetcher.applyResponseHandlers(info)
  //     expect(handledInfo.response.test).toBeDefined()
  //     expect(handledInfo.response.test).toEqual('test')
  //     expect(handledInfo.data).toBeDefined()
  //     expect(handledInfo.data).toEqual('data')
  //   })
  // })
})

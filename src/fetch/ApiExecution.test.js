import Sinon from 'sinon'
import { mockAbortController } from '../../jest/mocks/AbortController.mock'
import { mockFetch } from '../../jest/mocks/fetch.mock'
import { defaultHeaders } from '../utils/defaultHeaders'
import { ApiExecution } from './ApiExecution'

const sandbox = Sinon.createSandbox()

describe('ApiExecution', () => {
  let enhancer1
  let enhancer2
  let handler1
  let handler2
  let abort
  let fetch

  beforeEach(() => {
    enhancer1 = sandbox.stub().callsFake((req) => Promise.resolve({ ...req, foo: 'foo1' }))
    enhancer2 = sandbox.stub().callsFake((req) => Promise.resolve({ ...req, foo: 'foo2' }))
    handler1 = sandbox.stub().callsFake((req, res) => Promise.resolve({ ...res, baz: 'baz1' }))
    handler2 = sandbox.stub().callsFake((req, res) => Promise.resolve({ ...res, baz: 'baz2' }))
    abort = sandbox.stub()
    fetch = sandbox.stub().callsFake(() => ({
      ok: true,
      json: () => 'foo data',
    }))

    mockFetch(fetch)
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
      ...customConfig,
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
        customHeader2: 'another test',
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
        keepalive: false,
      }
      const req = await execution.composeRequest({ method: 'GET', path: '/', options })
      expect(req).toEqual({
        method: 'GET',
        headers: defaultHeaders,
        body: undefined,
        signal: 'foo signal',
        ...options,
      })
    })
  })

  describe('applyRequestEnhancers', () => {
    it('enhance initial request info', async () => {
      const execution = createApiExecution()
      const info = { method: 'GET', path: 'foo/path', options: {} }
      const enhancedInfo = await execution.applyRequestEnhancers(info)
      expect(enhancer1.calledOnce).toBeTruthy()
      expect(enhancer1.firstCall.args[0]).toEqual(info)
      expect(enhancer2.calledOnce).toBeTruthy()
      expect(enhancer2.firstCall.args[0]).toEqual({ ...info, foo: 'foo1' })
      expect(enhancedInfo).toEqual({ ...info, foo: 'foo2' })
    })
  })

  describe('applyResponseHandlers', () => {
    it('handle initial response info', async () => {
      const execution = createApiExecution()
      const requestInfo = { method: 'GET', path: 'foo/path', options: {} }
      const response = new Response('')
      const responseInfo = { response, data: response }
      const handledInfo = await execution.applyResponseHandlers(requestInfo, responseInfo)
      expect(handler1.calledOnce).toBeTruthy()
      expect(handler1.firstCall.args[0]).toEqual(requestInfo)
      expect(handler1.firstCall.args[1]).toEqual(responseInfo)
      expect(handler2.calledOnce).toBeTruthy()
      expect(handler2.firstCall.args[0]).toEqual(requestInfo)
      expect(handler2.firstCall.args[1]).toEqual({ ...responseInfo, baz: 'baz1' })
      expect(handledInfo).toEqual({ ...responseInfo, baz: 'baz2' })
    })
  })

  describe('_execStep', () => {
    it('resolve the promise', async () => {
      const execution = createApiExecution()
      const promise = sandbox.stub().callsFake(() => Promise.resolve('foo result'))
      const result = await execution._execStep(promise)
      expect(result).toEqual('foo result')
    })

    it('returns null if _abort flag is set to true', async () => {
      const execution = createApiExecution()
      execution._abort = true
      const promise = sandbox.stub().callsFake(() => Promise.resolve('foo result'))
      const result = await execution._execStep(promise)
      expect(result).toBeNull()
    })
  })

  describe('fetch', () => {
    it('calls fetch', async () => {
      const execution = createApiExecution()
      const responseInfo = await execution.fetch({ method: 'GET', path: '/', options: {} })
      expect(fetch.calledOnce).toBeTruthy()
      expect(responseInfo.response.json()).toEqual('foo data')
    })
  })

  describe('exec', () => {
    it('calls functionalities in the correct order', async () => {
      const execution = createApiExecution({ method: 'GET', path: '/', options: {} })
      const result = await execution.exec()
      // apply enhancers
      expect(enhancer1.calledOnce).toBeTruthy()
      expect(enhancer2.calledOnce).toBeTruthy()
      // fetch
      expect(fetch.calledOnce).toBeTruthy()
      // apply handlers
      expect(handler1.calledOnce).toBeTruthy()
      expect(handler2.calledOnce).toBeTruthy()
      expect(result.json()).toEqual('foo data')
    })
  })

})

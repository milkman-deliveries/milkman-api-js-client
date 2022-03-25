import Sinon from 'sinon'
import * as ApiExecution from './ApiExecution'
import { ApiFetcher } from './ApiFetcher'

const sandbox = Sinon.createSandbox()

describe('ApiFetcher', () => {
  let ApiExecutionStub
  let execStub

  beforeEach(() => {
    execStub = Sinon.stub()
    ApiExecutionStub = Sinon.stub().callsFake(() => ({
      exec: execStub
    }))
    sandbox.stub(ApiExecution, 'ApiExecution').callsFake(ApiExecutionStub);
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('fetch', () => {
    it('creates a new ApiExecution object and calls the exec method on it', async () => {
      const fetcher = new ApiFetcher()
      const requestInfo = { method: 'GET', path: '/', options: {} }
      await fetcher.fetch(requestInfo)
      expect(ApiExecutionStub.calledOnce).toBeTruthy()
      expect(ApiExecutionStub.firstCall.args[0]).toEqual(requestInfo)
      expect(execStub.calledOnce).toBeTruthy()
    })
  })
})

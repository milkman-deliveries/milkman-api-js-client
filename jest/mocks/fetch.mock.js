import Sinon from 'sinon'

const defaultStub = Sinon.stub().callsFake((...args) => Promise.resolve({
  ok: true,
  json: () => args,
}))

export const mockFetch = (
  stub = defaultStub,
) => jest
  .spyOn(global, 'fetch')
  .mockImplementation(stub)

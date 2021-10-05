import { ApiLazyLoading } from './ApiLazyLoading'

describe('ApiLazyLoading', () => {

  it('basic usage', () => {
    const lazy = new ApiLazyLoading()
    expect(lazy.load(50)).toEqual('skip=0&limit=50')
    expect(lazy.load(20)).toEqual('skip=50&limit=20')
    expect(lazy.load(20)).toEqual('skip=70&limit=20')
    expect(lazy.load(20)).toEqual('skip=90&limit=20')
    lazy.reset()
    expect(lazy.load(20)).toEqual('skip=0&limit=20')
  })
})

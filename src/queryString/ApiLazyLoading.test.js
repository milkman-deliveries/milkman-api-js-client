import { ApiLazyLoading } from './ApiLazyLoading'

describe('ApiLazyLoading', () => {

  it('default configuration', () => {
    const lazy = new ApiLazyLoading()
    expect(lazy.toString()).toEqual('skip=0&limit=0')
  })

  it('set limit', () => {
    const lazy = new ApiLazyLoading(50)
    expect(lazy.toString()).toEqual('skip=0&limit=50')
    lazy.setLimit(30)
    expect(lazy.toString()).toEqual('skip=0&limit=30')
  })

  it('update skip', () => {
    const lazy = new ApiLazyLoading(50)
    expect(lazy.toString()).toEqual('skip=0&limit=50')
    lazy.skipMore(50)
    expect(lazy.toString()).toEqual('skip=50&limit=50')
    lazy.skipMore(50)
    expect(lazy.toString()).toEqual('skip=100&limit=50')
  })
})
